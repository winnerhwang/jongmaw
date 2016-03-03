<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="swkm0100";
$masterKey   ="stk_no";
$slaveKey    ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'] || $_REQUEST['search']=='0')  {
    $xcmd="get-items";
  }
}
//$db->debug=true;
switch ($xcmd) {
    case 'get-records':
//        $sql  = "SELECT * FROM " . $masterTable
//              ." WHERE  ORDER BY ~sort~";
        $sql = "SELECT autoid,
	swkm0100.stk_no , stkm0100.stk_namc ,
	swkm0100.ser_no ,
	swkm0100.wkt_no	, wktm0100.wkt_na	,
	swkm0100.cust_no, venm0100.cust_abbr cust_na,
	swkm0100.price  , swkm0100.note  FROM
((swkm0100 INNER JOIN stkm0100 USING(stk_no) )
      LEFT OUTER JOIN wktm0100 USING(wkt_no) )
      LEFT OUTER JOIN venm0100 ON swkm0100.cust_no=venm0100.cust_no "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT wkt_no,CONCAT(wkt_na,' | ',FORMAT(price,2)) as wkt_pri FROM " . $masterTable
               ." LEFT OUTER JOIN wktm0100 USING(wkt_no) "
               ." WHERE stk_no = '".$_REQUEST['stk_no']."' AND wkt_no LIKE '". $reqSearch ."%' ORDER BY stk_no , wkt_no LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $slaveKey, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
//        $sql = "SELECT *
//                FROM " .$masterTable
        $sql = "SELECT autoid,
	swkm0100.stk_no , stkm0100.stk_namc ,   stkm0100.wkcost ,
	swkm0100.ser_no ,
	swkm0100.wkt_no	, wktm0100.wkt_na	,
	swkm0100.cust_no, venm0100.cust_abbr cust_na,
	swkm0100.price  , swkm0100.note  FROM
((swkm0100 INNER JOIN stkm0100 USING(stk_no) )
      LEFT OUTER JOIN wktm0100 USING(wkt_no) )
      LEFT OUTER JOIN venm0100 ON swkm0100.cust_no=venm0100.cust_no "
             ." WHERE ".$slaveKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        unset($reqrec['record']['stk_namc']);
        unset($reqrec['record']['wkt_na']);
        unset($reqrec['record']['cust_abbr']);
        unset($reqrec['record']['cust_na']);
        unset($reqrec['record']['wkcost']);
        $res = $w2grid->saveRecord($masterTable, $slaveKey, $reqrec);
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