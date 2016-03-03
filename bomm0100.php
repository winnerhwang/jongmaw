<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="bomm0100";
$masterKey   ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT autoid
    	,  bomm0100.bom_no , bom.stk_namc bom_na
    	,  bomm0100.stk_no , stk.stk_namc stk_na , stk.wkcost
    	,  bomm0100.qty    , bomm0100.ser_no
     FROM (bomm0100
    LEFT JOIN stkm0100 stk USING(stk_no))
    LEFT JOIN stkm0100 bom ON (bomm0100.bom_no=bom.stk_no) "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT DISTINCT bom_no, stk.stk_namc bom_na FROM " . $masterTable
               ."  LEFT JOIN stkm0100 stk ON (bomm0100.bom_no=stk.stk_no) "
               ." WHERE bom_no LIKE '". $reqSearch ."%' ORDER BY bom_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
//        $sql = "SELECT *
//                FROM " .$masterTable
        $sql  = "SELECT autoid
    	,  bomm0100.bom_no , bom.stk_namc bom_na
    	,  bomm0100.stk_no , stk.stk_namc stk_na , stk.wkcost
    	,  bomm0100.qty    , bomm0100.ser_no
     FROM (bomm0100
    LEFT JOIN stkm0100 stk USING(stk_no))
    LEFT JOIN stkm0100 bom ON (bomm0100.bom_no=bom.stk_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        unset($reqrec['record']['stk_na']);
        unset($reqrec['record']['wkcost']);
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