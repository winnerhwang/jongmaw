<?php
$rpt['output']=(!empty($output)?$output:"html");
if ($rpt['output']=="pdf"){
  require_once('tcpdf_include.php');
  //echo "PDF";
  $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
// set document information
//$pdf->SetCreator(PDF_CREATOR);
//$pdf->SetAuthor('Nicola Asuni');
//$pdf->SetTitle('TCPDF Example 038');
//$pdf->SetSubject('TCPDF Tutorial');
//$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
//$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 038', PDF_HEADER_STRING);
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

  // set margins
  $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
//  $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
//  $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
  // set auto page breaks
  $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
  // set font
  $pdf->SetFont('cid0ct', '', 10);
//  $pdf->SetFont('cid0ct', '', 16);
//$pdf->SetFont('helvetica', '', 8);
// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}
  $html=<<<EOT
  <h1>TEST</h1>
  <table border="0"  cellspacing="0">
    <thead><tr><td>
        FOOT AAA</td><td>BBB</td><td>ccc
    </td></tr></thead>
    <tbody>
      <tr><td>AAA</td><td>BBB</td><td>ccc</td></tr>
      <tr><td>A中文字AA</td><td>BBB</td><td>ccc</td></tr>
      <tr><td colspan="3">
        <span style="float:left; text-align:left" >111111</span>
        <span style="float:right; text-align:right">3333</span>
        <span style="float:none; text-align:center">22222</span>
      </td></tr>
      <tr><td colspan="3">
        <table border="0">
          <tr>
          <td>qwerrt</td>
          <td>asdfsdf</td>
          <td>zxcvbb</td>
          </tr>
          <tr>
          <td>qwerrt</td>
          <td>asdfsdf</td>
          <td>zxcvbb</td>
          </tr>
        </table>
      </td></tr>
    </tbody>
    <tfoot><tr><td colspan="3">
                <table cellspacing=0><tr><td>DDDASD</td><td>sdf</td></tr></table>
    </td></tr></tfoot>
  </table>
EOT;
/*
      <table><tr><td>
      </td></tr></table>

*/
  // add a page
//  $pdf->AddPage();
//  $pdf->writeHTML($html, true, false, false, false, '');


}
// 報表樣版
$rpt['paperSize']=(!empty($paperSize)?$paperSize:"A4P");
$rpt['item']['dataRow']=(empty($data)?array():$data);//=array(array("123","abc","fgg","qwer"));
$rpt['item']['dataSum']=(empty($dsum)?array():$dsum);//=array(array("123","abc","fgg","qwer"));
$rpt['item']['rowsCnt']=count($data);
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
foreach ($data as $r => $row ) {
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
  }
  $rpt['item']['current']++;
  $html.= genReport("page-item",$rpt);
}
if (($rpt['item']['current']%$rpt['item']['maxRows'])>0) {
  $html.= genReport("page-sum",$rpt);
  $html.= genReport("page-foot",$rpt);
    if ($rpt['output']=="pdf") {
      $pdf->AddPage();
      //$pdf->writeHTML($html, true, false, false, false, '');
      //echo $html;
    }
}
//print_r($cols);
//print_r($data);
if (($rpt['output']=="html")) echo $html . genReport("html-foot",$rpt);
else if (!empty($html) && $rpt['output']=="pdf"){
  $pdf->Output('report1.pdf', 'I');
}

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
   $html .= "<table class=\"".$rpt['paperSize']." pageEject\" border=\"0\">";
/*   $html .= " <thead class='head'><tr><td>";
   $html .= "  <table width='100%' ><tbody><tr>";
   $html .= "   <td colspan=3 class=rptTitle>" . tranPageDate($rpt['head']['Title']) . "</td></tr><tr>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"45%":"30%"). "' class=rptHeadLeft>".  tranPageDate($rpt['head']['Left'])."</td>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"10%":"40%"). "' class=rptHeadMiddle>".tranPageDate($rpt['head']['Middle'])."</td>";
   $html .= "   <td width='". (empty($rpt['head']['Middle'])?"45%":"30%"). "' class=rptHeadRight>". tranPageDate($rpt['head']['Right'])."</td>";
   $html .= "  </tr></tbody></table>";
   $html .= "  </td></tr></thead>";
*/   $html .= "<tbody><tr class=\"head\"><td colspan=\"".$rpt['head']['maxCols']."\" class=\"head\">";
   $html .= "  <table width=\"100%\" class=\"head\" border=\"0\"><tr>";
   $html .= "   <td colspan=3 class=rptTitle>" . tranPageDate($rpt['head']['Title']) . "</td></tr><tr>";
   $html .= "   <td width=\"". (empty($rpt['head']['Middle'])?"45%":"30%"). "\" class=\"rptHeadLeft\">".  tranPageDate($rpt['head']['Left'])."</td>";
   $html .= "   <td width=\"". (empty($rpt['head']['Middle'])?"10%":"40%"). "\" class=\"rptHeadMiddle\">".tranPageDate($rpt['head']['Middle'])."</td>";
   $html .= "   <td width=\"". (empty($rpt['head']['Middle'])?"45%":"30%"). "\" class=\"rptHeadRight\">". tranPageDate($rpt['head']['Right'])."</td>";
   $html .= "  </tr></table></td></tr>";
   $html .= " <tr><td class=\"listarea\"><table class=\"data\" width=\"100%\" border=\"0\"><tr >";
      $cols = $rpt['head']['column'];
      foreach ($cols as $c) {
          $html .= "<th ".(!empty($c['width'])?"width=\"".$c['width']."\"":"").">";
          $html .=        (!empty($c['text' ])?$c['text']:"&nbsp;");
          $html .= "</th>";
      }
   $html .="</tr>";
    break;
  case "page-item":
      $cols = $rpt['head']['column'];
      $data = $rpt['item']['dataRow'][$rpt['item']['current']-1];
      $html.= "\n<tr>";
      foreach ($cols as $c) {
        if  (empty($data[$c['field' ]])) $v =  "&nbsp;" ;
        else {
          $v = $data[$c['field' ]];
          if (!empty($c['format' ])) {
            $f = $c['format' ];
            if (strpos($f , ":")>=0) {
              $tmp = explode(":",$f,2);
              if ($tmp[0]=="d") {
                $v = date($tmp[1], strtotime($v));
              } else if ($tmp[0]=="n") {
                $v = number_format($v,$tmp[1],".", ",");
                //$v = sprintf($tmp[1],$v) ;
              }
            } else {
              $v = sprintf($f,$v) ;
            }
          }
        }
        $html.= "<td ".(!empty($c['class'])?"class=\"".$c['class']."\"":"").">";
        $html.=        (!empty($data[$c['field' ]])?$v:"&nbsp;");
        $html.= "</td>";
      }
      $html.="</tr>";
    break;
  case "page-sum":
      $cols = $rpt['head']['column'];
      $isSum=false;
      foreach ($cols as $c) { if  (!empty($c['foot'])) { $isSum =  true ;} }
      //echo $isSum;
      if (!$isSum) break;
      $data = $rpt['item']['dataSum'];
      //print_r( $data);
      $html.= "\n<tr class='dsum'>";
      foreach ($cols as $c) {
        if  (!empty($c['foot']) && !($c['foot']=="sum"||$c['foot']=="avg"||$c['foot']=="cnt")) {
          $data[$c['field' ]] = $c['foot'];
        }
        if  (empty($data[$c['field' ]])) $v =  "&nbsp;" ;
        else {
          $v = $data[$c['field' ]];
          if (!empty($c['format' ])) {
            $f = $c['format' ];
            if (strpos($f , ":")>=0) {
              $tmp = explode(":",$f,2);
              if ($tmp[0]=="d") {
                $v = date($tmp[1], strtotime($v));
              } else if ($tmp[0]=="n") {
                $v = number_format($v,$tmp[1],".", ",");
                //$v = sprintf($tmp[1],$v) ;
              }
            } else {
              $v = sprintf($f,$v) ;
            }
          }
        }
        $html.= "<td ".(!empty($c['class'])?"class=\"".$c['class']."\"":"").">";
        $html.=        (!empty($data[$c['field' ]])?$v:"&nbsp;");
        $html.= "</td>";
      }
    break;
  case "page-foot":
   $html .= "           </table></td></tr>";
   $html .= "</tbody>";
   $html .= "      <tfoot class='foot' valign=bottom><tr><td><table width='100%' ><tbody><tr>";
   $html .= "   <td width=\"". (empty($rpt['foot']['Middle'])?"45%":"30%"). "\" class=\"rptFootLeft\">".  tranPageDate($rpt['foot']['Left'])."</td>";
   $html .= "   <td width=\"". (empty($rpt['foot']['Middle'])?"10%":"40%"). "\" class=\"rptFootMiddle\">".tranPageDate($rpt['foot']['Middle'])."</td>";
   $html .= "   <td width=\"". (empty($rpt['foot']['Middle'])?"45%":"30%"). "\" class=\"rptFootRight\">". tranPageDate($rpt['foot']['Right'])."</td>";
   $html .= "        </tr></tbody></table></td></tr></tfoot>";
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