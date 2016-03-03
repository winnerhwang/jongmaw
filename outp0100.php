<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mcust_no= (empty($_REQUEST['range']['cust_no'])?"":$_REQUEST['range']['cust_no']);
$mdoc_no = $_REQUEST['range']['doc_no'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"Letter2":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  20 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?10:0+$maxRows);
$headTitle="忠懋企業股份有限公司<br>應收帳款請款單";
//$headLeft ="廠商:" . $_REQUEST['range']['cust_no'] ."-".$_REQUEST['param']['cust_fn']. " Tel:".$_REQUEST['param']['tel1'] . " Fax:".$_REQUEST['param']['fax'];
//$headRight="製表日期: ~~today~~ " ;
$cols = array(
   array("field"=>"stk_no" , "text"=>"產品編號" ,"width"=>70 )
  ,array("field"=>"stk_na" , "text"=>"產品名稱" )
  ,array("field"=>"spec"   , "text"=>"規格" )
  ,array("field"=>"qty"    , "text"=>"數量"     ,"width"=>40 ,"class"=>"right", "format"=>"n:0" )
  ,array("field"=>"unit"   , "text"=>"單位"     ,"width"=>40 )
  ,array("field"=>"price"  , "text"=>"單價"     ,"width"=>60 ,"class"=>"right", "format"=>"n:2" )
  ,array("field"=>"amt"    , "text"=>"金額"     ,"width"=>80 ,"class"=>"right", "format"=>"n:2" )
  ,array("field"=>"note"   , "text"=>"備註"     ,"width"=>100  )                  // , "format"=>"d:Y/m/d"
);
//$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
//$footRight= "~~curpg~~ / ~~pages~~ 頁";
//$sqlc= (empty($mcust_no)?"": " AND outh0100.cust_no='".$mcust_no."' ");
$sqlh= "SELECT outh0100.doc_no, outh0100.date, outh0100.cust_no, outh0100.tax_no
    , outh0100.portcar , outh0100.caramt, outh0100.taxamt, outh0100.amt, outh0100.remark
  	,cusm0100.cust_name cust_na, cusm0100.tel1, cusm0100.fsn , cusm0100.fax
  FROM outh0100
  LEFT OUTER JOIN cusm0100 USING(cust_no)
  WHERE outh0100.doc_no='$mdoc_no' ";
$sqli= "SELECT outi0100.stk_no, outi0100.qty, outi0100.price, outi0100.amt, outi0100.note
	 ,stkm0100.stk_namc stk_na, stkm0100.unitc unit, stkm0100.spec spec
  FROM outi0100
  LEFT OUTER JOIN stkm0100 USING(stk_no)
  WHERE outi0100.doc_no='$mdoc_no' ";
include "inc_mysql.php";
$db1 = new dbclass();
$lnk=$db1->dbConnect();
if (!$lnk) {
  $db1->dbErrMsg(true);
} else if( !($db1->dbQuery($sqli)) ) {
  $db1->dbErrMsg(true);
} else {
  $data=array();
  while ($row=$db1->dbRead()) {
    $data[]=$row;
  }
  $hdata = array();
  if( !($db1->dbQuery($sqlh)) ) {
    $db1->dbErrMsg(true);
  } else {
    $hdata=$db1->dbRead();
  }
}
$db1->dbClose();
$hamt1 = $hdata['amt'] - $hdata['portcar'] - $hdata['caramt'];
$hamt2 = $hamt1 + $hdata['taxamt'] ;
$headLeft ="客戶編號:" . $hdata['cust_no'] ."　統一編號:".$hdata['fsn']. "　Tel:".$hdata['tel1']
  ."<br>客戶名稱:" . $hdata['cust_na'] ;    // . " Fax:".$hdata['fax']
$headRight="出貨單號:" . $hdata['doc_no'] ."<br>出貨日期:" . $hdata['date'];
$footLeft="<table>"
    ."<tr><td>發票號碼:".$hdata['tax_no'] ."</td><td>"
    ."<tr><td>".$hdata['remark'] ."</td><td>"
    ."<tr><td><div class='font12 center'>~~curpg~~ / ~~pages~~ 頁<div></td></tr></table>"
    ."<br>經理:";
$footMiddle="<table class='right'>"
    ."<tr><td>銷售合計:</td><td width='100px'>".sprintf('%12.2f',$hdata['amt']    ) ."</td></tr>"
    ."<tr><td>扣港工捐:</td><td>".sprintf('%12.2f',$hdata['portcar']) ."</td></tr>"
    ."<tr><td>扣 運 費:</td><td>".sprintf('%12.2f',$hdata['caramt'] ) ."</td></tr></table>"
    ."<br><div class='left'>會計:</div>";
$footRight ="<table class='right'>"
    ."<tr><td>合計金額:</td><td width='100px'>".sprintf('%12.2f',$hamt1           ) ."</td></tr>"
    ."<tr><td>營 業 稅:</td><td>".sprintf('%12.2f',$hdata['taxamt'] ) ."</td></tr>"
    ."<tr><td>總計金額:</td><td>".sprintf('%12.2f',$hamt2           ) ."</td></tr></table>"
    ."<br><div class='center'>製表:</div>";
//print_r($hdata);
//print_r($data);
//foreach ($hdata as $f => $v) echo '\n<br>'.$f.':'.gettype($v).$v;
include "tmpl_report1.php";
//echo $sql;
?>