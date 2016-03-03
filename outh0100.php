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
$slaveTable  ="outi0100";
$slaveKey    ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
if ($xcmd == "save-record") {
// 更新 合計金額
        $sqlu = "UPDATE outh0100 SET outh0100.amt =
            (SELECT SUM(outi0100.amt) FROM outi0100 WHERE doc_no='". $_REQUEST['record']['doc_no'] ."')
          WHERE outh0100.doc_no='". $_REQUEST['record']['doc_no'] ."'";
}
switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT	outh0100.doc_no , DATE_FORMAT(outh0100.date,'%Y/%m/%d') as date     , outh0100.cust_no FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        if ($res['status']=='success' && !empty($sqld)) {            $res = $w2grid->updateSlave($sqld);        }
        break;
    case 'get-record':
        $sql = "SELECT  DATE_FORMAT(outh0100.date,'%Y/%m/%d') as date , DATE_FORMAT(outh0100.date1,'%Y/%m/%d') as date1 ,
	outh0100.doc_no , outh0100.yymm     , outh0100.toaddr , outh0100.amt ,
  outh0100.car    , outh0100.car1     , outh0100.inv      , outh0100.tax      , outh0100.mail   , outh0100.pay_kind ,
  outh0100.rec_f  , outh0100.tax_no   , outh0100.portcar  , outh0100.caramt   , outh0100.remark , outh0100.dscnt ,
  outh0100.usdtwd , outh0100.currate  , outh0100.usd_amt  , outh0100.cash   , outh0100.cash3p   , outh0100.taxamt ,
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
        unset($reqrec['record']['cust_na']);
        unset($reqrec['record']['cust_abbr']);
        $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
        if ($res['status']=='success' && !empty($sqlu)) {            $res = $w2grid->updateSlave($sqlu);        }
        $w2grid->outputJSON($res);
        break;
    case 'auto-no':
        $prefix = $_REQUEST['prefix'];
        $sql = "SELECT ".$masterKey." FROM ".$masterTable." WHERE ".$masterKey." LIKE '".$prefix."%' ORDER BY ".$masterKey." DESC LIMIT 1";
        $res = $w2grid->getRecord($sql);
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