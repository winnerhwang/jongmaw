<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="cusm0100";
$masterKey   ="cust_no";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT cust_no, cust_abbr, tel1 FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT cust_no,cust_abbr FROM " . $masterTable
               ." WHERE cust_no LIKE '". $reqSearch ."%' ORDER BY cust_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT cust_no , cust_abbr , cust_name , cust_taxn
          , tel1 , tel2 , tel3 , fax , co_addr1 ,co_addr2 , co_addr3 , co_addr4  , email1 , email2
          , boss , contact , fsn  , remail , lstdate , c_class , c_buy , pay_kind , vip , bank_acc , bank_no
          , remark1 , remark2 , remark3  , DATE_FORMAT(date_set,'%Y/%m/%d') as date_set
                FROM " .$masterTable
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $res = $w2grid->saveRecord($masterTable, $masterKey, $_REQUEST);
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