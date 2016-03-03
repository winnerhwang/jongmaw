<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="isuh0100";
$masterKey   ="doc_no";
$slaveTable  ="isui0100";
$slaveKey    ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT	isuh0100.doc_no , DATE_FORMAT(isuh0100.date,'%Y/%m/%d') as date     , isuh0100.cust_no FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        //if ($res['status']=='success' && !empty($sqld)) {            $res = $w2grid->updateSlave($sqld);        }
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT
	isuh0100.doc_no , DATE_FORMAT(isuh0100.date,'%Y/%m/%d') as date     , isuh0100.yymm     , isuh0100.toaddr , isuh0100.amt , isuh0100.remark ,  isuh0100.tran_no ,
	isuh0100.cust_no, venm0100.cust_abbr cust_na
	  FROM  isuh0100 LEFT OUTER JOIN venm0100 USING(cust_no) "
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