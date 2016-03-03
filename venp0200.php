<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbgn_cus = $_REQUEST['range']['bgn_cus'];
$mend_cus = $_REQUEST['range']['end_cus'];
$mcuslist = $_REQUEST['param']['cuslist'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="廠商資料對照表";
//$headLeft ="機種:" . $_REQUEST['range']['bom_no'] . " - ".$_REQUEST['range']['bom_na'] ;
//$headRight="基數:" . $mqty ;
$cols = array(
   array("field"=>"cust_no" , "text"=>"編號"    ,"width"=>"40px")
  ,array("field"=>"cust_name","text"=>"名稱"    ,"width"=>"170px" )
  ,array("field"=>"tel1"    , "text"=>"電話"    ,"width"=>"80px")
  ,array("field"=>"fax"     , "text"=>"傳真"    ,"width"=>"80px")
  ,array("field"=>"tel3"    , "text"=>"行動電話","width"=>"90px" )
//  ,array("field"=>"boss"    , "text"=>"負責人"  ,"width"=>"60px" )
  ,array("field"=>"co_addr1", "text"=>"公司地址" )
);
$headLeft = "製表日期: ~~today~~ ";
$headRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
if (empty($mcuslist))  $sqlwhere = " venm0100.cust_no >= '$mbgn_cus' AND venm0100.cust_no <= '$mend_cus' ";
else    $sqlwhere= " venm0100.cust_no in ( '" . str_replace( "," , "','" ,$mcuslist) . "' ) ";
$sql= "SELECT cust_no , cust_name , tel1 , fax , tel3 , boss , co_addr1
        FROM  venm0100
        WHERE $sqlwhere
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
}
include "tmpl_report1.php";
//echo $sql;
?>