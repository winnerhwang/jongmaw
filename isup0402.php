<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mcust_no = $_REQUEST['range']['cust_no'];
$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$mstk_no = (empty($_REQUEST['range']['stk_no'])?"":$_REQUEST['range']['stk_no']);
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="廠商入庫明細表";
$headLeft ="廠商:".$mcust_no." - ".$_REQUEST['param']['cust_na'] ;
$headRight="日期:" . $mbgn_dt . " - " . $mend_dt;
$cols = array(
   array("field"=>"date"   , "text"=>"入庫日期" , "format"=>"d:Y/m/d"   )
  ,array("field"=>"doc_no" , "text"=>"入庫單號" , "foot"=>"小計/平均")
  ,array("field"=>"stk_no" , "text"=>"貨品"     , "width"=>"50px")
  ,array("field"=>"stk_na" , "text"=>"貨品名稱" )
  ,array("field"=>"wkt_no" , "text"=>"加工"    , "width"=>"40px")
  ,array("field"=>"wkt_na" , "text"=>"加工名"  , "width"=>"50px")
  ,array("field"=>"qty"    , "text"=>"入庫量"  ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"price"  , "text"=>"單價"    ,"class"=>"right", "format"=>"n:2" , "foot"=>"avg")
  ,array("field"=>"amt"    , "text"=>"入庫額"  ,"class"=>"right", "format"=>"n:2" , "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
$footMiddle=(empty($mcust_no)?"": "過濾貨品:" . $_REQUEST['range']['stk_no'] . " - ".$_REQUEST['param']['stk_na']);
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sqlc= (empty($mstk_no)?"": " AND isui0100.stk_no='".$mstk_no."' ");
$sql= "SELECT isuh0100.date , isuh0100.cust_no
        , isui0100.stk_no   , isui0100.qty , isui0100.price , isui0100.amt  , isui0100.doc_no
        , stkm0100.stk_namc stk_na
        , isui0100.wkt_no , wktm0100.wkt_na
        FROM ((isui0100
        LEFT OUTER JOIN isuh0100 USING(doc_no))
        LEFT OUTER JOIN stkm0100 ON isui0100.stk_no=stkm0100.stk_no)
        LEFT OUTER JOIN wktm0100 USING(wkt_no)
        WHERE isuh0100.cust_no = '$mcust_no'
          AND isuh0100.date >= '$mbgn_dt' AND isuh0100.date <= '$mend_dt' $sqlc
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
echo $sql;
?>