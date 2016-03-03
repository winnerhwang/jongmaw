<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="crcm0100";
$masterKey   ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT  crcm0100.autoid , crcm0100.yymm
          , crcm0100.cust_no , cusm0100.cust_abbr cust_na
          , crcm0100.bln_amt , crcm0100.flag
          FROM crcm0100 LEFT OUTER JOIN cusm0100 USING(cust_no) "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT cust_no,cust_name FROM " . $masterTable
               ." WHERE cust_no LIKE '". $reqSearch ."%' ORDER BY cust_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql  = "SELECT  crcm0100.autoid , crcm0100.yymm  , DATE_FORMAT(crcm0100.date,'%Y/%m/%d') as date
          , crcm0100.cust_no , cusm0100.cust_abbr cust_na
          , crcm0100.out_amt , crcm0100.bad_amt , crcm0100.lst_amt , crcm0100.dsc_amt , crcm0100.csh_amt , crcm0100.c3p_amt
          , crcm0100.tax_rate, crcm0100.tax_amt , crcm0100.sal_amt , crcm0100.pre_amt , bln_amt
          , crcm0100.amt_rec , crcm0100.bad_rec , crcm0100.c3p_rec , crcm0100.dsc_rec , crcm0100.rec_amt , crcm0100.bln_rec
          , crcm0100.note1 , crcm0100.note2 , crcm0100.note3 , crcm0100.note4 , crcm0100.note5
          , crcm0100.note6 , crcm0100.note7 , crcm0100.flag
          FROM crcm0100 LEFT OUTER JOIN cusm0100 USING(cust_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        unset($reqrec['record']['cust_na'  ]);
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