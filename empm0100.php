<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="empm0100";
$masterKey   ="emp_no";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT emp_no , emp_name , id_no , DATE_FORMAT(br_date,'%Y/%m/%d') as br_date FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT emp_no,emp_name FROM " . $masterTable
               ." WHERE emp_no LIKE '". $reqSearch ."%' ORDER BY emp_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT emp_no , emp_name , name
            , DATE_FORMAT(br_date,'%Y/%m/%d') as br_date , DATE_FORMAT(in_date,'%Y/%m/%d') as in_date , DATE_FORMAT(fr_date,'%Y/%m/%d') as fr_date
            , id_no , passport , addr1 , addr2
            , tel , mate , sons , job , bank , acc , sry_no
            , base , base1 , plus3 , plus4 , plus5 , mnus3 , mnus4  , mnus5 , mnus9
                FROM " .$masterTable
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
        $w2grid->outputJSON($res);
        break;
    default:
        $res = Array();
        $res['status']  = 'error';
        $res['message'] = 'Command "'.$xcmd.'" is not recognized.';
        $res['postData']= $_REQUEST;
        $w2grid->outputJSON($res);
        break;
}