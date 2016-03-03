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
$mcust_no = (empty($_REQUEST['range']['cust_no'])?"":$_REQUEST['range']['cust_no']);
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="貨品出貨明細表";
$headLeft ="貨品:" . $_REQUEST['range']['stk_no'] . " - ".$_REQUEST['param']['stk_na'] ;
$headRight="日期:" . $mbgn_dt . " - " . $mend_dt;
$cols = array(
   array("field"=>"date"   , "text"=>"出貨日期" , "format"=>"d:Y/m/d"   )
  ,array("field"=>"doc_no" , "text"=>"出貨單號" , "foot"=>"小計/平均")
  ,array("field"=>"cust_no", "text"=>"客戶編號" )
  ,array("field"=>"cust_na", "text"=>"客戶簡稱" )
  ,array("field"=>"qty"    , "text"=>"銷售量"  ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"price"  , "text"=>"單價"    ,"class"=>"right", "format"=>"n:2" , "foot"=>"avg")
  ,array("field"=>"amt"    , "text"=>"銷售額"  ,"class"=>"right", "format"=>"n:2" , "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sqlc= (empty($mcust_no)?"": " AND outh0100.cust_no='".$mcust_no."' ");
$sql= "SELECT outh0100.date , outh0100.cust_no
        , outi0100.stk_no   , outi0100.qty , outi0100.price , outi0100.amt  , outi0100.doc_no
        , cusm0100.cust_abbr cust_na
        FROM  (outi0100
        LEFT OUTER JOIN outh0100 USING(doc_no))
        LEFT OUTER JOIN cusm0100 ON outh0100.cust_no=cusm0100.cust_no
        WHERE outi0100.stk_no = '$mstk_no'
          AND outh0100.date >= '$mbgn_dt' AND outh0100.date <= '$mend_dt' $sqlc
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
  $sqlsum = "SELECT SUM(qty) as qty , AVG(price) as price , SUM(amt) as amt FROM ($sql) AS just_sum";
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