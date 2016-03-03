<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mqty = (empty($_REQUEST['param']['qty'])?"1":$_REQUEST['param']['qty']);

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="機種庫存表";
$headLeft ="機種:" . $_REQUEST['range']['bom_no'] . " - ".$_REQUEST['range']['bom_na'] ;
$headRight="基數:" . $mqty ;
$cols = array(
   array("field"=>"ser_no" , "text"=>"件號"    ,"width"=>"70px")
  ,array("field"=>"stk_no" , "text"=>"零件料號","width"=>"70px" )
  ,array("field"=>"stk_na" , "text"=>"件名" )
  ,array("field"=>"spec"   , "text"=>"規格" )
  ,array("field"=>"req_qty", "text"=>"需求量"  ,"width"=>"70px","class"=>"right", "format"=>"n:0" )
  ,array("field"=>"stk_qty", "text"=>"庫存數"  ,"width"=>"70px","class"=>"right", "format"=>"n:0" )
);
$footLeft = "製表日期: ~~today~~ ";
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$mbom_no = $_REQUEST['range']['bom_no'];
$sql= "SELECT bomm0100.bom_no , bomm0100.ser_no
        , bomm0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.spec , stkm0100.qty stk_qty
        , bomm0100.qty * $mqty req_qty
        FROM  bomm0100
        LEFT OUTER JOIN stkm0100 USING(stk_no)
        WHERE bomm0100.bom_no = '$mbom_no'
        ORDER BY ser_no , stk_no";
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