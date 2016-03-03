<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="srym0100";
$masterKey   ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT  srym0100.autoid , srym0100.yymm
          , srym0100.emp_no , empm0100.emp_name emp_na , empm0100.id_no
          FROM srym0100 LEFT OUTER JOIN empm0100 USING(emp_no) "
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
        $sql  = "SELECT  srym0100.autoid , srym0100.yymm
          , srym0100.emp_no , empm0100.emp_name emp_na , empm0100.id_no , empm0100.job
          , DATE_FORMAT(empm0100.in_date,'%Y/%m/%d') as in_date
          , DATE_FORMAT(empm0100.fr_date,'%Y/%m/%d') as fr_date
          , empm0100.mate , empm0100.sons , empm0100.bank , empm0100.acc , empm0100.base1
          , srym0100.adddd , srym0100.adddh , srym0100.addnd , srym0100.addnh
          , srym0100.hol1d , srym0100.hol1h , srym0100.hol2d , srym0100.hol2h
          , srym0100.base  , srym0100.remark
          , srym0100.plus1 , srym0100.plus2 , srym0100.plus3 , srym0100.plus4 , srym0100.plus5
          , srym0100.plus6 , srym0100.plus7 , srym0100.plus8 , srym0100.plus9 , srym0100.food1
          , srym0100.mnus1 , srym0100.mnus2 , srym0100.mnus3 , srym0100.mnus4 , srym0100.mnus5 , srym0100.mnus9
          , srym0100.amt   , srym0100.amt1
          FROM srym0100 LEFT OUTER JOIN empm0100 USING(emp_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        unset($reqrec['record']['emp_na']);
        unset($reqrec['record']['id_no']);
        unset($reqrec['record']['job']);
        unset($reqrec['record']['in_date']);
        unset($reqrec['record']['fr_date']);
        unset($reqrec['record']['mate']);
        unset($reqrec['record']['sons']);
        unset($reqrec['record']['bank']);
        unset($reqrec['record']['acc']);
        unset($reqrec['record']['base1']);
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