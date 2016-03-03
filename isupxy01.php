<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mstk_no = $_REQUEST['range']['stk_no'];
$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="貨品入庫數量交叉分析統計表";
$headLeft ="貨品:" . $_REQUEST['range']['stk_no'] . " - ".$_REQUEST['param']['stk_na'] ;
$headRight="日期:" . $mbgn_dt . " - " . $mend_dt;
$cols = array(
   array("field"=>"cust_no" , "text"=>"廠商編號", "width"=>"80px" )
  ,array("field"=>"cust_na" , "text"=>"廠商簡稱", "foot"=>"小計/平均")
  ,array("field"=>"tel1"    , "text"=>"廠商電話" )
  ,array("field"=>"amt"     , "text"=>"進貨金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"amt1"    , "text"=>"退貨金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"amts"    , "text"=>"合計金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"remark"    , "text"=>"備註"    ,"class"=>"right", "format"=>"n:2", "width"=>"40px")
);
$footLeft = "製表日期: ~~today~~ ";
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sql= "SELECT isu.cust_no, isu.wkt_no, isu.date, isu.qty
      	, venm0100.cust_abbr cust_na
    FROM (
    SELECT stk_no,cust_no,wkt_no,DATE_FORMAT(date,'%Y/%m/%d') date, SUM(qty) qty
    FROM isui0100
    LEFT OUTER JOIN isuh0100 USING(doc_no)
     WHERE stk_no = '$mstk_no'
     AND date>='$mbgn_dt' AND date<='$mend_dt'
     GROUP BY stk_no,cust_no,wkt_no,date
    ) as isu
    LEFT OUTER JOIN venm0100 USING(cust_no)
        ORDER BY $msort ";
include "inc_mysql.php";
$db1 = new dbclass();
$lnk=$db1->dbConnect();
if (!$lnk) {
  $db1->dbErrMsg(true);
} else if( !($db1->dbQuery($sql)) ) {
  $db1->dbErrMsg(true);
} else {
  $data=array();
  while ($row=$db1->dbRead()) {
    $data[]=$row;
  }
  $sqlcol = "SELECT cust_no , cust_na , wkt_no , SUM(qty) qty FROM ($sql) AS just_col GROUP BY cust_no , cust_na , wkt_no  ORDER BY cust_no , cust_na , wkt_no ";
  $hcols = array("cust_no","cust_na","wkt_no");
  $dcol = array();
  if( !($db1->dbQuery($sqlcol)) ) {
    $db1->dbErrMsg(true);
  } else {
    while ($row=$db1->dbRead()) {
      $dcol[]=$row;
    }
  }
}
// 編制 xy
if (!empty($data) ) {
    $cntcols = count($hcols);
    $htmltr = array();
    for ($i=0; $i<$cntcols; $i++) {
      $htmltr[$i] = "<tr class='colHead'>".($i==0?"<th rowspan='$cntcols'>":"")."&nbsp;</th>" ;
    //$tr1=$tr2=$tr3="<tr><td>&nbsp;</td>";
      foreach($dcol as $c) {
        $htmltr[$i] .= "<th>".$c[$hcols[$i]]."</th>";
      }
      $htmltr[$i] .= "</tr>";
    }
  $xydata = array();
  foreach ($data as $row) {
    $xcust_no = $row['cust_no'];
    $xwkt_no  = $row['wkt_no'];
    //$xstk_no  = $row['stk_no'];
    $xdate    = $row['date'];
    if (empty($xydata[$xdate])) $xydata[$xdate] = array();
    if (empty($xydata[$xdate][$xcust_no])) $xydata[$xdate][$xcust_no] = array();
    $xydata[$xdate][$xcust_no][0]=$row['cust_no'];
    $xydata[$xdate][$xcust_no][1]=$row['cust_na'];
    if (empty($xydata[$xdate][$xcust_no][$xwkt_no])) $xydata[$xdate][$xcust_no][$xwkt_no] = array();
    $xydata[$xdate][$xcust_no][$xwkt_no][0]=$row['wkt_no'];
    $xydata[$xdate][$xcust_no][$xwkt_no][1]=$row['qty'];
  }
}
// 報表樣版
$rpt['output']=(!empty($output)?$output:"html");
$rpt['paperSize']=(!empty($paperSize)?$paperSize:"A4P");
$rpt['item']['dataRow']=(empty($xydata)?array():$xydata);//=array(array("123","abc","fgg","qwer"));
$rpt['item']['dataSum']=(empty($dsum)?array():$dsum);//=array(array("123","abc","fgg","qwer"));
$rpt['item']['rowsCnt']=count($xydata);
$rpt['item']['maxRows']=(!empty($maxRows)?$maxRows:30);
$rpt['item']['current']=0;
$rpt['page']['pages']= floor($rpt['item']['rowsCnt']/$rpt['item']['maxRows'])+1;
$rpt['page']['current']=0;
$rpt['head']['Title']=(!empty($headTitle)?$headTitle:"");
$rpt['head']['Left']=(!empty($headLeft)?$headLeft:"");
$rpt['head']['Middle']=(!empty($headMiddle)?$headMiddle:"");
$rpt['head']['Right']=(!empty($headRight)?$headRight:"");
$rpt['head']['column']=$cols; //=array("col1","col2","col3","col4");
$rpt['head']['maxCols']=count($cols);
$rpt['foot']['Left']=(!empty($footLeft)?$footLeft:"");
$rpt['foot']['Middle']=(!empty($footMiddle)?$footMiddle:"");
$rpt['foot']['Right']=(!empty($footRight)?$footRight:"");
$html="";
if (($rpt['output']=="html")) $html.= genReport("html-head",$rpt);
if (count($data)==0){  echo "<h2>無符合條件資料...</h2>"; }
else {  // gen report
  //$html.= genReport("page-head",$rpt);
  //$html .= "<tr><td class='listarea'><table width='100%' class='data'>";
  foreach ($xydata as $dt => $r) {
    //      重印  表尾 表頭
    if (($rpt['item']['current']%$rpt['item']['maxRows'])==0) {
      if ( $rpt['item']['current']>0) {
        $html.= genReport("page-foot",$rpt);
        if ($rpt['output']=="pdf"){
          $pdf->writeHTML($html, true, false, false, false, '');
          //echo "<xmp>".$html."</xmp>";
        }
      }
      $rpt['page']['current']++;
      if ($rpt['output']=="pdf"){
        $pdf->AddPage();
      } else { echo $html;}
      $html="";
      $html.= genReport("page-head",$rpt);
      $html .= "<tr><td class='listarea'><table width='100%' class='data'>";
      for ($i=0; $i<$cntcols; $i++) { $html .= $htmltr[$i]; }
    }

    // 筆 資料
    $html .= "<tr><td class='rowHead'>".$dt."</td>" ;
    foreach($dcol as $c) {
      $xcus = $c['cust_no'];
      $xwkt = $c['wkt_no'];
      if (!empty($r[$xcus][$xwkt])) {
        $html .= "<td class='rowData'>". $r[$xcus][$xwkt][1] ."</td>";
      } else {
        $html .= "<td>&nbsp;</td>";
      }
    }
    $rpt['item']['current']++;
    $html .= "</tr>";
  }
  // 合計
    $html .= "<tr class='dsum'><td class='rowHead'>合計</td>" ;
    foreach($dcol as $c) {
      $html .= "<td class='rowData'>". $c['qty'] ."</td>";
    }
    $html .= "</tr>";
  $html .= "</table></td></tr>";
  //echo "<html><body>".$html."</body></html>";
  $html.= genReport("page-foot",$rpt);
}
if (($rpt['output']=="html"))  echo $html . genReport("html-foot",$rpt);
else if (!empty($html) && $rpt['output']=="pdf"){
  $pdf->Output('report1.pdf', 'I');
}

//include "tmpl_report1.php";
//echo $sql;

function genReport($optr,$rpt) {
$html="";
switch ($optr)  {
  case "html-head":
    //if ($rpt['output']=="html") {
//<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
//<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
//<!DOCTYPE html>
$tt = $rpt['head']['Title'];
$thiscss = str_ireplace(".php",".css",$_SERVER['PHP_SELF']);
$html = <<<EOT
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="generator" content="winner huang">
  <title> $tt </title>
  <link type="text/css" rel="stylesheet" href="report1.css">
  <link type="text/css" rel="stylesheet" href="$thiscss">
  <script type="text/javascript" src="/jquery/jquery-2.1.1.min.js"></script>
  <script type="text/javascript" src="/jquery/jtable/jquery.battatech.excelexport.js"></script>
  <script type="text/javascript" src="report1.js"></script>
  </head>
  <body><div id="expExcel" class='expExcel dontPrint'>EXCEL</div><div id='xlsData' class='dontDisplay'></div><div id='printData'>
EOT;

    break;
  case "page-head":
   $html .= "<table class='".$rpt['paperSize']." pageEject' border='0'>";
   $html .= "<tbody><tr class='head'><td colspan='".$rpt['head']['maxCols']."' class='head'>";
   $html .= "  <table width='100%' class='head' border='0'><tr>";
   $html .= "   <td colspan=3 class=rptTitle>" . tranPageDate($rpt['head']['Title']) . "</td></tr><tr>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"45%":"30%"). "' class='rptHeadLeft'>".  tranPageDate($rpt['head']['Left'])."</td>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"10%":"40%"). "' class='rptHeadMiddle'>".tranPageDate($rpt['head']['Middle'])."</td>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"45%":"30%"). "' class='rptHeadRight'>". tranPageDate($rpt['head']['Right'])."</td>";
   $html .= "  </tr></table></td></tr>";
    break;
  case "page-head":
    break;

  case "page-foot":
   $html .= "  </table></td></tr>";
   $html .= "</tbody>";
   $html .= "<tfoot class='foot' valign=bottom><tr><td><table width='100%' ><tbody><tr>";
   $html .= "   <td width='". (empty($rpt['foot']['Middle'])?"45%":"30%"). "' class=\"rptFootLeft\">".  tranPageDate($rpt['foot']['Left'])."</td>";
   $html .= "   <td width='". (empty($rpt['foot']['Middle'])?"10%":"40%"). "' class=\"rptFootMiddle\">".tranPageDate($rpt['foot']['Middle'])."</td>";
   $html .= "   <td width='". (empty($rpt['foot']['Middle'])?"45%":"30%"). "' class=\"rptFootRight\">". tranPageDate($rpt['foot']['Right'])."</td>";
   $html .= "  </tr></tbody></table></td></tr></tfoot>";
   $html .= "</table>";
    break;
  case "html-foot":
    if ($rpt['output']=="html") {
      $html.= "</div></body></html>";
    }
    break;
  case "page-break":
    $html.= "<div class='pageEject'></div>" ;
    break;
  default:
    break;
}
return $html;
}
function tranPageDate($srcString) {
global $rpt;
$rtn="";
if (!empty($srcString)) {
  $rtn = str_ireplace("~~today~~", date('Y/m/d'), $srcString);
  $rtn = str_ireplace("~~curpg~~", "".$rpt['page']['current'], $rtn);
  $rtn = str_ireplace("~~pages~~", "".$rpt['page']['pages'], $rtn);
}
//echo $srcString . "=>" . $rtn ;
return $rtn;
}
?>