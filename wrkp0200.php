<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbom_no= (empty($_REQUEST['range']['bom_no'])?"":$_REQUEST['range']['bom_no']);
//$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="廠商己訂未交貨明細表";
$headLeft ="機種:" . $_REQUEST['range']['bom_no'] . " - ".$_REQUEST['param']['bom_na'] ;
$headRight="預定交貨日期:" .  $mend_dt;
$cols = array(
   array("field"=>"cust_no", "text"=>"廠商編號" ,"width"=>80 )
  ,array("field"=>"cust_na", "text"=>"廠商簡稱" , "foot"=>"小計/平均")
  ,array("field"=>"tel1"   , "text"=>"電話" )
  ,array("field"=>"date1"  , "text"=>"預定交貨" ,"width"=>80 , "format"=>"d:Y/m/d"   )
  ,array("field"=>"doc_no" , "text"=>"託工單號" ,"width"=>80 )
  ,array("field"=>"stk_no" , "text"=>"貨品編號" ,"width"=>80 )
  ,array("field"=>"stk_na" , "text"=>"貨品名稱" )
  ,array("field"=>"qty"    , "text"=>"訂購量"   ,"width"=>80 ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"ins_qty", "text"=>"已交量"   ,"width"=>80 ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"qty1"   , "text"=>"不足數"   ,"width"=>80 ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
//$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
//$sqlc= (empty($mcust_no)?"": " AND outh0100.cust_no='".$mcust_no."' ");
$sql= "SELECT wrkm0100.date1 , wrkm0100.cust_no  , wrkm0100.doc_no
        , wrkm0100.stk_no   , wrkm0100.qty , wrkm0100.ins_qty , wrkm0100.qty-wrkm0100.ins_qty  qty1
        , venm0100.cust_abbr cust_na  , venm0100.tel1
        , stkm0100.stk_namc stk_na
        FROM  (wrkm0100
        LEFT OUTER JOIN venm0100 USING(cust_no))
        LEFT OUTER JOIN stkm0100 USING(stk_no)
        WHERE wrkm0100.bom_no = '$mbom_no'
          AND wrkm0100.date1<>'' AND wrkm0100.date1 <= '$mend_dt'
          AND wrkm0100.qty>wrkm0100.ins_qty
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
  $sqlsum = "SELECT SUM(qty) as qty , SUM(ins_qty) as ins_qty , SUM(qty1) as qty1 FROM ($sql) AS just_sum";
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