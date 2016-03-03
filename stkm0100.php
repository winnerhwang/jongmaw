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
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT stk_no , stk_namc , spec FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
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
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT stk_no , stk_name , stk_namc , spec , mtrl , unit , unitc , kind , sal_knd , always
            , ntcost , uscost , pricent , priceus , price , price1 , slr_prcnt , wkcost
            , qty , safeqty , ord_qty , netkg , grwkg , flow , flow_pri  , DATE_FORMAT(set_date,'%Y/%m/%d') as set_date
            , cust_no , cust_abbr , wkt
                FROM " .$masterTable
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        unset($reqrec['record']['cust_na']);
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
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