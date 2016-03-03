<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="vrcm0100";
$masterKey   ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'get-records':
        $sql  = "SELECT  vrcm0100.autoid , vrcm0100.yymm
          , vrcm0100.cust_no , venm0100.cust_abbr cust_na
          , vrcm0100.sal_amt , vrcm0100.flag
          FROM vrcm0100 LEFT OUTER JOIN venm0100 USING(cust_no) "
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
        $sql  = "SELECT  vrcm0100.autoid , vrcm0100.yymm  , DATE_FORMAT(vrcm0100.date,'%Y/%m/%d') as date
          , vrcm0100.cust_no , venm0100.cust_abbr cust_na
          , vrcm0100.out_amt , vrcm0100.bad_amt , vrcm0100.lst_amt , vrcm0100.dsc_amt , vrcm0100.csh_amt , vrcm0100.c3p_amt
          , vrcm0100.wrk_amt , vrcm0100.wrk_bad , vrcm0100.wrk_add
          , vrcm0100.tax_rate, vrcm0100.tax_amt , vrcm0100.sal_amt , vrcm0100.pre_amt , bln_amt
          , vrcm0100.amt_rec , vrcm0100.bad_rec , vrcm0100.c3p_rec , vrcm0100.dsc_rec , vrcm0100.rec_amt , vrcm0100.bln_rec
          , vrcm0100.note1 , vrcm0100.note2 , vrcm0100.note3 , vrcm0100.note4 , vrcm0100.note5
          , vrcm0100.note6 , vrcm0100.note7 , vrcm0100.flag
          FROM vrcm0100 LEFT OUTER JOIN venm0100 USING(cust_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST[$masterKey] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
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