<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="isui0100";
$masterKey   ="autoid";
$slaveTable  ="isuh0100";
$slaveKey    ="doc_no";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}
switch ($xcmd) {
    case 'delete-records':
        $keyVal = $_REQUEST['search'][0]['value'];
        break;
    case 'save-record':
        $keyVal = $_REQUEST['record'][$slaveKey];
        break;
    default :
        $keyVal = "";
        break;
}
// 更新 合計金額
        $sqlu = "UPDATE isuh0100 SET isuh0100.amt =
            (SELECT SUM(isui0100.amt) FROM isui0100 WHERE ". $slaveKey ."='". $keyVal ."')
          WHERE ". $slaveKey ."='". $keyVal ."'";
switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT	isui0100.autoid   , isui0100.doc_no  , isui0100.wrk_no
        , isuh0100.tran_no , isuh0100.date
        , isui0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.unitc  , stkm0100.spec
        , isui0100.qty    , isui0100.price , isui0100.amt    , isui0100.in_stk  , wkt_no
        FROM " . $masterTable
        . " LEFT OUTER JOIN isuh0100 USING(doc_no) "
        . " LEFT OUTER JOIN stkm0100 USING(stk_no) "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords( $sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        if ($res['status']=='success' && !empty($sqlu)) {            $res = $w2grid->updateSlave($sqlu);        }
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT	isui0100.autoid   , isui0100.doc_no  , isui0100.wrk_no
        , isui0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.unitc  , stkm0100.spec
        , isui0100.qty    , isui0100.price , isui0100.amt   , isui0100.in_stk , wkt_no
        FROM " . $masterTable
        . " LEFT OUTER JOIN stkm0100 USING(stk_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        unset($reqrec['record']['wkt_na']);
        unset($reqrec['record']['stk_na']);
        unset($reqrec['record']['unitc']);
        unset($reqrec['record']['spec']);
        if ($reqrec['record']['recid']==0 || $reqrec['record']['recid']=='') { }
        else  unset($reqrec['record']['autoid']);
        $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
        if ($res['status']=='success' && !empty($sqlu)) {            $res = $w2grid->updateSlave($sqlu);        }
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