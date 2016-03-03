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
$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="客戶期間出貨明細表";
$headLeft ="客戶:" . $_REQUEST['range']['cust_no'] . " - ".$_REQUEST['param']['cust_na'] ;
$headRight="日期:" . $mbgn_dt . " - " . $mend_dt;
$cols = array(
   array("field"=>"date"   , "text"=>"出貨日期" ,"width"=>80 , "format"=>"d:Y/m/d"   )
  ,array("field"=>"doc_no" , "text"=>"出貨單號" ,"width"=>80 , "foot"=>"小計/平均")
  ,array("field"=>"stk_no" , "text"=>"貨品編號" ,"width"=>80 )
  ,array("field"=>"stk_na" , "text"=>"貨品名稱" )
  ,array("field"=>"spec"   , "text"=>"規格" )
  ,array("field"=>"qty"    , "text"=>"銷售量"  ,"width"=>80 ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"unit"   , "text"=>"單位"    ,"width"=>40)
  ,array("field"=>"price"  , "text"=>"單價"    ,"width"=>80 ,"class"=>"right", "format"=>"%10.2f" )
  ,array("field"=>"amt"    , "text"=>"銷售額"  ,"width"=>120,"class"=>"right", "format"=>"n:2" , "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
//$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
//$sqlc= (empty($mcust_no)?"": " AND outh0100.cust_no='".$mcust_no."' ");
$sql= "SELECT outh0100.date , outh0100.cust_no
        , outi0100.stk_no   , outi0100.qty , outi0100.price , outi0100.amt  , outi0100.doc_no
        , stkm0100.stk_namc stk_na , stkm0100.spec , stkm0100.unitc unit
        FROM  (outi0100
        LEFT OUTER JOIN outh0100 USING(doc_no))
        LEFT OUTER JOIN stkm0100 USING(stk_no)
        WHERE outh0100.cust_no = '$mcust_no'
          AND outh0100.date >= '$mbgn_dt' AND outh0100.date <= '$mend_dt'
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
  $sqlsum = "SELECT SUM(qty) as qty , SUM(amt) as amt FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }
}
$db1->dbClose();

include "tmpl_report1.php";
//echo $sql;
?>