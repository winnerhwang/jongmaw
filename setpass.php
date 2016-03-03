<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="pass";
$masterKey   ="name";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT name , usr_name , menugroup FROM " . $masterTable
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT name,usr_name FROM " . $masterTable
               ." WHERE name LIKE '". $reqSearch ."%' ORDER BY name LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT name , usr_name , menugroup , password
                FROM " .$masterTable
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $res['record']['password']= ($res['record']['password']);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec= $_REQUEST;
        $xrecd = $_REQUEST['record'];
        $xpass = (htmlspecialchars(urldecode($xrecd['password'])));
        $reqrec['record']['password']= $xpass;
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
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