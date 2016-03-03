<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="outh0100";
$masterKey   ="doc_no";
$slaveKey    ="autoid";
$xcmd = $_REQUEST['cmd'];
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
//        $sql  = "SELECT * FROM " . $masterTable
//              ." WHERE  ORDER BY ~sort~";
        $sql = "SELECT	outh0100.doc_no , DATE_FORMAT(outh0100.date_set,'%Y/%m/%d') as date_set , outh0100.cust_no FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $sql  = "SELECT stk_no,stk_namc FROM " . $masterTable
               ." WHERE stk_no LIKE '". $_REQUEST['search'] ."%' ORDER BY stk_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT  DATE_FORMAT(outh0100.date_set,'%Y/%m/%d') as date_set ,
	outh0100.doc_no , outh0100.yymm     , outh0100.date1    , outh0100.toaddr ,
  outh0100.car    , outh0100.car1     , outh0100.inv      , outh0100.tax      , outh0100.mail   , outh0100.pay_kind ,
  outh0100.rec_f  , outh0100.tax_no   , outh0100.portcar  , outh0100.caramt   , outh0100.remark ,
  outh0100.cash   , outh0100.cash3p   , outh0100.usdtwd   , outh0100.currate  , outh0100.usd_amt
	outh0100.cust_no, cusm0100.cust_abbr cust_na
	  FROM  outh0100 LEFT OUTER JOIN cusm0100 USING(cust_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        unset($reqrec['record']['wkt_na']);
        unset($reqrec['record']['cust_abbr']);
        $res = $w2grid->saveRecord($masterTable, $slaveKey, $reqrec);
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