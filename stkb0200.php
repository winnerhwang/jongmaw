<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="stkm0100";
$masterKey   ="stk_no";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
    $stkno=$_REQUEST['search'][0]['value'];
    $bgndt=$_REQUEST['search'][1]['value'];
switch ($xcmd) {
    case 'get-records':
        $sql  = "
SELECT stk_no , stkm0100.stk_namc stk_na, stkm0100.unitc unit, stkm0100.spec
  , date , tr , doc_no , bln_stk.cust_no
  , bln_stk.qty srqty
  , CASE WHEN pm>0 THEN '進' WHEN pm<0 THEN '出' ELSE '' END as pm
  , CASE  WHEN pm>0 THEN bln_stk.qty ELSE 0 END inqty
  , CASE  WHEN pm<0 THEN bln_stk.qty ELSE 0 END outqty
  , bnqty
  FROM (
SELECT 'NOW' tr , stk_no, 0 pm , qty , '' doc_no , '' cust_no , '9999/99/99' date ,qty bnqty
	FROM stkm0100
	WHERE stk_no= '$stkno'
UNION
SELECT '託工入庫' tr , isui0100.stk_no
  , CASE in_stk WHEN 'Y' THEN  1 ELSE 0 END as pm
  , qty , doc_no , cust_no , DATE_FORMAT(date,'%Y/%m/%d') date
  , 0 bnqty
	FROM isui0100 LEFT OUTER JOIN isuh0100 USING(doc_no)
	WHERE stk_no= '$stkno' AND date>='$bgndt'
--	AND in_stk='Y'
UNION
SELECT '客戶出貨' tr , outi0100.stk_no
  ,  -1 as pm
  , qty , doc_no , cust_no , DATE_FORMAT(date,'%Y/%m/%d') date
  , 0 bnqty
	FROM outi0100 LEFT OUTER JOIN outh0100 USING(doc_no)
	WHERE stk_no= '$stkno' AND date>='$bgndt'
UNION
SELECT '工令領用' tr , wodi0100.stk_no
  , CASE wodi0100.flag WHEN '*' THEN -1 ELSE 0 END as pm
  , wodi0100.qty , doc_no , cust_no , DATE_FORMAT(date,'%Y/%m/%d') date
  , 0 bnqty
	FROM wodi0100 LEFT OUTER JOIN wodh0100 USING(doc_no)
	WHERE wodi0100.stk_no= '$stkno' AND date>='$bgndt'
UNION
SELECT '工令完工' tr , bom_no stk_no
  , CASE wodh0100.flag WHEN 'Y' THEN  1 ELSE 0 END as pm
  , qty , doc_no , cust_no , DATE_FORMAT(date,'%Y/%m/%d') date
  , 0 bnqty
	FROM wodh0100
	WHERE bom_no= '$stkno' AND date>='$bgndt'
) as bln_stk
INNER JOIN stkm0100 USING (stk_no)
ORDER BY stk_no,date DESC,tr,cust_no,doc_no ";
//               WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT stk_no,stk_namc FROM " . $masterTable
               ." WHERE stk_no LIKE '". $reqSearch ."%' ORDER BY stk_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    default:
        $res = Array();
        $res['status']  = 'error';
        $res['message'] = 'Command "'.$_REQUEST['cmd'].'" is not recognized.';
        $res['postData']= $_REQUEST;
        $w2grid->outputJSON($res);
        break;
}