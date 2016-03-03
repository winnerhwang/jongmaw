<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbase = $_REQUEST['param']['base'];
$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="託工入庫統計表";
$headLeft ="日期:" . $mbgn_dt . " - " . $mend_dt;
$headRight="平均基數:" . $mbase;
$cols = array(
   array("field"=>"stk_no" , "text"=>"貨品編號", "width"=>"80px" )
  ,array("field"=>"stk_na" , "text"=>"貨品名稱" , "foot"=>"小計/平均")
  ,array("field"=>"spec"   , "text"=>"貨品規格" )
  ,array("field"=>"out_cnt", "text"=>"筆數"    ,"class"=>"right", "format"=>"n:0", "width"=>"40px", "foot"=>"sum")
  ,array("field"=>"qty"    , "text"=>"入庫量"  ,"class"=>"right", "format"=>"n:0", "width"=>"60px", "foot"=>"sum")
  ,array("field"=>"amt"    , "text"=>"入庫額"  ,"class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"avg_qty", "text"=>"平均量"  ,"class"=>"right", "format"=>"n:2", "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sql= "SELECT  isui0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.spec
        , SUM(isui0100.qty) qty , SUM(isui0100.amt) amt, COUNT(doc_no) out_cnt
        , SUM(isui0100.qty)/ $mbase as avg_qty
        FROM  (isui0100 LEFT OUTER JOIN stkm0100 USING(stk_no))
		      LEFT OUTER JOIN isuh0100 USING(doc_no)
        WHERE isuh0100.date >= '$mbgn_dt' AND isuh0100.date <= '$mend_dt'
        GROUP BY stk_no
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
  $sqlsum = "SELECT SUM(out_cnt) out_cnt , SUM(qty) as qty , SUM(amt) as amt , SUM(avg_qty) as avg_qty FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }
}
include "tmpl_report1.php";
//echo $sql;
?>