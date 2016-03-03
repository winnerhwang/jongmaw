<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$myymm = $_REQUEST['range']['yymm'];
$mcust_no   = $_REQUEST['range']['cust_no'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="忠懋企業股份有限公司<br>應付帳款對帳單";
$headLeft ="廠商:" . $_REQUEST['range']['cust_no'] ."-".$_REQUEST['param']['cust_fn']. " Tel:".$_REQUEST['param']['tel1'] . " Fax:".$_REQUEST['param']['fax'] ."<br>地址:".$_REQUEST['param']['addr1'];
$headRight="帳款月份:" . $myymm ."<br>製表日期: ~~today~~ ";
$cols = array(
   array("field"=>"date"   , "text"=>"日期"    , "width"=>"40px" , "format"=>"d:m/d")
  ,array("field"=>"tran_no", "text"=>"原單號"  , "width"=>"60px", "foot"=>"小計")
//  ,array("field"=>"bom_no" , "text"=>"機種"    ,"width"=>50 )
  ,array("field"=>"stk_no" , "text"=>"料號"    ,"width"=>60 )
  ,array("field"=>"stk_na" , "text"=>"名稱" )
  ,array("field"=>"spec"   , "text"=>"規格" )
  ,array("field"=>"qty"    , "text"=>"數量"    ,"width"=>60 ,"class"=>"right", "format"=>"n:2" )
//  ,array("field"=>"unit"   , "text"=>"單位"    ,"width"=>40 )
  ,array("field"=>"price"  , "text"=>"單價"    ,"width"=>60,"class"=>"right", "format"=>"n:2")
  ,array("field"=>"amt"    , "text"=>"小計"    ,"width"=>80,"class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"amts"   , "text"=>"合計金額","width"=>80,"class"=>"right", "format"=>"n:0")
);
//$footLeft = "製表日期: ~~today~~ ";
//$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sql= "SELECT isuh0100.date, isuh0100.doc_no, isuh0100.tran_no, isuh0100.amt amts
 , isui0100.bom_no, isui0100.stk_no, isui0100.qty, isui0100.price, isui0100.amt
 , stkm0100.stk_namc stk_na, stkm0100.spec
FROM (isuh0100
	LEFT OUTER JOIN isui0100 USING(doc_no) )
	LEFT OUTER JOIN stkm0100 USING(stk_no)
WHERE isuh0100.cust_no='$mcust_no'
  AND isuh0100.yymm = '$myymm'
        ORDER BY $msort ";

$sqlrc= "SELECT wrk_amt,wrk_bad,lst_amt,tax_amt,dsc_amt,wrk_add,bln_amt,note1,note2,note3,note4,note5,note6,note7
FROM vrcm0100
WHERE vrcm0100.cust_no='$mcust_no'
  AND vrcm0100.yymm = '$myymm'
        LIMIT 1 ";
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
  $sqlsum = "SELECT SUM(amt) amt  FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }
  $datarc=array();
  if( !($db1->dbQuery($sqlrc)) ) {
    $db1->dbErrMsg(true);
  } else {
    $datarc=$db1->dbRead();
  }
}
$dt="";
$doc="";
$amts="";
$i=0;
foreach ($data as $r) {
  if ($r['date']   ==$dt  )  {$data[$i]['date']   =""; } else {$dt  =$r['date']; }
  if ($r['tran_no']==$doc )  {$data[$i]['tran_no']=""; } else {$doc =$r['tran_no']; }
  if ($r['amts']   ==$amts)  {$data[$i]['amts']   =""; } else {$amts=$r['amts']; }
  $i++;
}
$paydesc="
<div class='center'>付 款 明 細</div>
　茲寄上支票號碼
<br>共＿＿＿張，敬請查收！
<br>如蒙收訖，請蓋章後寄回本公司
<br>謝謝！
<br><br>收款人簽章";
$rcnote = "<div style='padding:0px 5px 0px 10px'>備註:<br>".$datarc['note1']."<br>".$datarc['note2']."<br>".$datarc['note3']."<br>".$datarc['note4']."<br>".$datarc['note5']."<br>".$datarc['note6']."<br>".$datarc['note7']."</div><br><div class='center'>第 ~~curpg~~ ／ ~~pages~~ 頁</div>";
$footLeft="<table width='100%' >
<tr><td width='100px'>＋上期未收：</td><td class=right>".round($datarc['lst_amt'],0)."</td><td class='font12' rowspan=7>".$rcnote."</td><td rowspan=7 width='220px' valign='top'>".$paydesc."</td></tr>
<tr><td>＋託工金額：</td><td class=right>".round($datarc['wrk_amt'],0)."</td></tr>
<tr><td>－託工退貨：</td><td class=right>".round($datarc['wrk_bad'],0)."</td></tr>
<tr><td>＋加扣款額：</td><td class=right>".round($datarc['wrk_add'],0)."</td></tr>
<tr><td>＋營業稅額：</td><td class=right>".round($datarc['tax_amt'],0)."</td></tr>
<tr><td>－折讓折扣：</td><td class=right>".round($datarc['dsc_amt'],0)."</td></tr>
<tr><td>＝應付帳款：</td><td class=right>".round($datarc['bln_amt'],0)."</td></tr>
<table>";


include "tmpl_report1.php";
//echo $sql;
?>