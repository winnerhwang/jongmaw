<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbgn_dt = $_REQUEST['range']['bgn_dt'];
$mend_dt = $_REQUEST['range']['end_dt'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="外銷貨品成本統計分析表";
$headLeft ="日期: " . $mbgn_dt ." -> " . $mend_dt;
$headRight="製表日期: ~~today~~ ";
$cols = array(
   array("field"=>"stk_no" , "text"=>"貨號"    , "width"=>"55px" )
  ,array("field"=>"stk_na" , "text"=>"貨品名稱", "foot"=>"小計/平均")
  ,array("field"=>"ntcost" , "text"=>"成本價"  , "width"=>"50px","class"=>"right", "format"=>"n:2" )
  ,array("field"=>"qty1"   , "text"=>"銷售量"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"qty2"   , "text"=>"退回量"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"qty3"   , "text"=>"贈送量"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"qty"    , "text"=>"小計量"  , "width"=>"50px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"amt1"   , "text"=>"銷售額"  , "width"=>"70px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"amt2"   , "text"=>"退回額"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"cost1"  , "text"=>"銷成本"  , "width"=>"70px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"cost2"  , "text"=>"退成本"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"cost3"  , "text"=>"送成本"  , "width"=>"45px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"amt"    , "text"=>"合計金額", "width"=>"70px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"costs"  , "text"=>"合計成本", "width"=>"70px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"gprofit", "text"=>"毛利金額", "width"=>"70px","class"=>"right", "format"=>"n:0", "foot"=>"sum")
  ,array("field"=>"gpp"    , "text"=>"毛利率"  , "width"=>"45px","class"=>"right", "format"=>"n:2")
);
//$footLeft = "製表日期: ~~today~~ ";
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sql= "SELECT stk_no
	, stkm0100.stk_namc stk_na , stkm0100.ntcost
	, SUM(qty_1) qty1, SUM(qty_2) qty2, SUM(qty_3) qty3, SUM(qty_s) qty
	, SUM(amt_1) amt1, SUM(amt_2) amt2, SUM(amt_3) amt3, SUM(amt_s) amt
	, SUM(qty_1)*stkm0100.ntcost cost1
	, SUM(qty_2)*stkm0100.ntcost cost2
	, SUM(qty_3)*stkm0100.ntcost cost3
	, SUM(qty_s)*stkm0100.ntcost costs
	, SUM(amt_s) - SUM(qty_s)*stkm0100.ntcost gprofit
	,(SUM(amt_s) - SUM(qty_s)*stkm0100.ntcost) / SUM(amt_s)*100 gpp
FROM (
SELECT outi0100.stk_no
	, CASE WHEN outi0100.qty>0  AND outi0100.amt<>0 THEN outi0100.qty ELSE 0 END AS qty_1
	, CASE WHEN outi0100.qty<0  AND outi0100.amt<>0 THEN outi0100.qty ELSE 0 END AS qty_2
	, CASE WHEN outi0100.qty<>0 AND outi0100.amt=0  THEN outi0100.qty ELSE 0 END AS qty_3
	, outi0100.qty qty_s
	, CASE WHEN outi0100.qty>0  AND outi0100.amt<>0 THEN outi0100.amt ELSE 0 END AS amt_1
	, CASE WHEN outi0100.qty<0  AND outi0100.amt<>0 THEN outi0100.amt ELSE 0 END AS amt_2
	, CASE WHEN outi0100.qty<>0 AND outi0100.amt=0  THEN outi0100.amt ELSE 0 END AS amt_3
	, outi0100.amt amt_s
FROM outh0100
	LEFT OUTER JOIN outi0100 USING(doc_no)
WHERE outh0100.date>= '$mbgn_dt' AND outh0100.date<= '$mend_dt'
) AS tmpouti
	LEFT OUTER JOIN stkm0100 USING(stk_no)
GROUP BY stk_no
ORDER BY  $msort ";
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
  $sqlsum = "SELECT SUM(gprofit) gprofit ,(SUM(gprofit) / SUM(amt))*100 gpp
    , SUM(qty1 ) qty1 , SUM(qty2 ) as qty2 , SUM(qty3 ) as qty3 , SUM(qty) as qty
    , SUM(amt1 ) amt1 , SUM(amt2 ) as amt2 , SUM(amt3 ) as amt3 , SUM(amt) as amt
    , SUM(cost1) cost1, SUM(cost2) as cost2, SUM(cost3) as cost3, SUM(costs) as costs
    FROM ($sql) AS just_sum";
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