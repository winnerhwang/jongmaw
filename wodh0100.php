<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="wodh0100";
$masterKey   ="doc_no";
$slaveTable  ="wodi0100";
$slaveKey    ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT wodh0100.doc_no , wodh0100.stk_no  , DATE_FORMAT(wodh0100.date,'%Y/%m/%d') as date
        , wodh0100.qty  , wodh0100.flag   , wodh0100.color , wodh0100.label
    , wodh0100.bom_no   , stkm0100.stk_namc    stk_na  , stkm0100.spec
    , wodh0100.cust_no  , cusm0100.cust_abbr cust_na
	  FROM (wodh0100 LEFT OUTER JOIN stkm0100 ON wodh0100.bom_no=stkm0100.stk_no)
	                 LEFT OUTER JOIN cusm0100 ON wodh0100.cust_no=cusm0100.cust_no "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        if ($res['status']=='success' && !empty($sqld)) {   $res = $w2grid->updateSlave($sqld);        }
        break;
    case 'get-record':
        $sql = "SELECT wodh0100.doc_no , DATE_FORMAT(wodh0100.date,'%Y/%m/%d') as date , wodh0100.stk_no
        , wodh0100.qty  , wodh0100.flag   , wodh0100.color , wodh0100.label
    , wodh0100.bom_no   , stkm0100.stk_namc    stk_na  , stkm0100.spec
    , wodh0100.cust_no  , cusm0100.cust_abbr cust_na
	  FROM (wodh0100 LEFT OUTER JOIN stkm0100 ON wodh0100.bom_no=stkm0100.stk_no)
	                 LEFT OUTER JOIN cusm0100 ON wodh0100.cust_no=cusm0100.cust_no "
             ." WHERE ".$masterKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
          $reqrec = $_REQUEST;
        if(empty($_REQUEST['saveMode'])) {
          //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
          //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
          unset($reqrec['record']['cust_na']);
          unset($reqrec['record']['cust_abbr']);
          unset($reqrec['record']['stk_na']);
          unset($reqrec['record']['spec']);
          $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
          if ($res['status']=='success' && !empty($sqlu)) {   $res = $w2grid->updateSlave($sqlu);        }
        }
        else if($_REQUEST['saveMode']=='open-item') {       //  展開工令
          $mdoc_no = $reqrec['record']['doc_no'];
          $mbom_no = $reqrec['record']['bom_no'];
          $mqty    = $reqrec['record']['qty'];
          $sqlbom  = "SELECT ser_no,stk_no,qty base_qty FROM bomm0100 WHERE bom_no='$mbom_no' ORDER BY ser_no,stk_no";
          $bomres  = $w2grid->getRecords($sqlbom, null, $_REQUEST);
          $wodirec = array();
          foreach ($bomres['records'] as $bomrec) {
            $wodirec['autoid']= 0;
            $wodirec['doc_no']= $mdoc_no;
            //$wodirec['ser_no']= $bomrec['ser_no'];
            $wodirec['stk_no']= $bomrec['stk_no'];
            $wodirec['base_qty']= $bomrec['base_qty'];
            $wodirec['qty']= $bomrec['base_qty'] * $mqty;
            $res = $w2grid->newRecord($slaveTable , $wodirec);
          }
        } else if($_REQUEST['saveMode']=='stk-qty') {   // 扣庫存
          $mdoc_no = $reqrec['record']['doc_no'];
          $sqlflag = "UPDATE wodi0100 SET flag = '*' WHERE doc_no='$mdoc_no' AND (flag IS NULL OR flag!='*') ";
          $res = $w2grid->updateSlave($sqlflag);
               // 扣庫存在mysql trigger 中執行
               //$sqlqty = "UPDATE stkm0100 SET stk_qty = stk_qty - $mqty WHERE stk_no='$mstk_no'";
               //$res = $w2grid->updateSlave($sqlqty);
        } else {
        }
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