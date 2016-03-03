<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="wodi0100";
$masterKey   ="autoid";
$slaveTable  ="wodh0100";
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
//        $sqlu = "UPDATE wodh0100 SET wodh0100.amt =
//            (SELECT SUM(wodi0100.amt) FROM wodi0100 WHERE ". $slaveKey ."='". $keyVal ."')
//          WHERE ". $slaveKey ."='". $keyVal ."'";
switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT	wodi0100.autoid   , wodi0100.doc_no
        , wodi0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.unitc  , stkm0100.spec , stkm0100.qty stk_qty
        , wodi0100.qty    , wodi0100.flag , wodi0100.base_qty
        FROM (" . $masterTable
        . " LEFT OUTER JOIN stkm0100 USING(stk_no) ) "
       // . "   LEFT OUTER JOIN bomm0100 ON wodi0100._no= "
              ." WHERE ~search~ ORDER BY ~sort~";
        $res = $w2grid->getRecords( $sql, null, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        if ($res['status']=='success' && !empty($sqlu)) {     $res = $w2grid->updateSlave($sqlu);    }
        $w2grid->outputJSON($res);
        break;
    case 'get-record':
        $sql = "SELECT	wodi0100.autoid   , wodi0100.doc_no
        , wodi0100.stk_no , stkm0100.stk_namc stk_na , stkm0100.unitc  , stkm0100.spec
        , wodi0100.qty
        FROM " . $masterTable
        . " LEFT OUTER JOIN stkm0100 USING(stk_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        if($_REQUEST['saveMode']=='open-item') {       //  展開工令
          $mdoc_no = $reqrec['record']['doc_no'];
          $mbom_no = $reqrec['record']['bom_no'];
          $mqty    = $reqrec['record']['qty'];
          $sqlbom  = "SELECT ser_no,stk_no,qty base_qty FROM bomm0100 WHERE bom_no='$mbom_no' ORDER BY ser_no,stk_no";
          $bomres  = $w2grid->getRecords($sqlbom, null, $_REQUEST);
          $wodirec = array();
          foreach ($bomres['records'] as $bomrec) {
            $wodirec['autoid']= 0;
            $wodirec['doc_no']= $mdoc_no;
            //$wodirec['ser_no']= $bomrec['ser_no'];
            $wodirec['stk_no']= $bomrec['stk_no'];
            $wodirec['base_qty']= $bomrec['base_qty'];
            $wodirec['qty']= $bomrec['base_qty'] * $mqty;
            $res = $w2grid->newRecord($masterTable , $wodirec);
          }
        } else if($_REQUEST['saveMode']=='stk-qty') {   // 扣庫存
          $mdoc_no = $reqrec['record']['doc_no'];
          $mbom_no = $reqrec['record']['bom_no'];
          $mqty    = $reqrec['record']['qty'];
          $sqlwodi = "SELECT ser_no,stk_no,qty base_qty FROM wodi0100 WHERE doc_no='$mdoc_no' ORDER BY autoid";
          $wodires = $w2grid->getRecords($sqlwodi, null, $_REQUEST);
          $wodirec = array();
          $sqlflag = "UPDATE wodi0100 SET flag = '*'";
          foreach ($wodires['records'] as $wodirec) {
            if ($wodirec['flag']=="") {
               $wodirec['flage']="*";
               $mstk_no = $wodirec['stk_no'];
               $mqty = $wodirec['qty'];
               $res = $w2grid->updateSlave($sqlu);
               $sqlqty = "UPDATE stkm0100 SET stk_qty = stk_qty - $mqty WHERE stk_no='$mstk_no'";
               $res = $w2grid->updateSlave($sqlqty);
            }
          }
        }
        $w2grid->outputJSON($res);
        break;
    case 'save-records':    // update field FLAG ****       inline edit changed
        $chg=$_REQUEST['changes'];
        //$data = array("recid"=>array(),"record"=>array());
        //print_r( $chg) ;
        foreach ($chg as $r) {
          //$recid = $r['recid'];
          //$flag  = $r['flag'];
          $updata['recid']=$r['recid'];
          $updata['record']=array("autoid"=>$r['recid'],"flag"=>$r['flag']);
          //print_r($updata);
          $sql = "UPDATE wodi0100 SET flag='".$r['flag']."' WHERE autoid='".$r['recid']."'";
          //echo "\n<br>$sql";
          $res = $w2grid->saveRecord($masterTable, $masterKey, $updata);
        }
        $w2grid->outputJSON($res);
        break;
    case 'open-item':
        $mdoc_no = $_REQUEST['record']['doc_no'];
        $mqty    = $_REQUEST['record']['qty'];
/*        $prefix = implode("",explode('-', $_REQUEST['opdate'], -1));
        $sql = "SELECT ".$slaveKey." FROM ".$slaveTable." WHERE ".$slaveKey." LIKE '".$prefix."%' ORDER BY ".$masterKey." DESC LIMIT 1";
        $res = $w2grid->getRecord($sql);
        $lstdoc = substr($res['record'][$slaveKey], 6 ,4);
        $nxtdoc = $lstdoc + 1;
        $ndocno = $prefix . substr( str_repeat("0",4).$nxtdoc , -4);
*/
        $sql = "SELECT bom_no , stk_no , ser_no , qty as base_qty "
          ." FROM bomm0100 WHERE bom_no='".$_REQUEST['record']['bom_no']."' ORDER BY ser_no,stk_no";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $data = array();
        $data['status']  = "success";
        $data['total']  = $res['total'];
        $data['doc_no'] = $mdoc_no;
        $data['records'] = array();
        foreach ($res['records'] as $r => $d) {
          $data['records'][$r] = array();
          $data['records'][$r]['doc_no'] = $mdoc_no ;
          $data['records'][$r]['base_qty'] = $_REQUEST['opdate'];
          $data['records'][$r]['stk_no'] = $_REQUEST['stk_no'];
          $data['records'][$r]['qty'] = $_REQUEST['qty'];
          foreach ($d as $f => $v) {
            if ($f!='recid' && $f!='ser_no')  $data['records'][$r][$f] = $v;
          }
          $data['records'][$r]['amt'] = $data['records'][$r]['qty'] * $data['records'][$r]['price'];
        }
        foreach ($data['records'] as $n => $r) {
          $res = $w2grid->newRecord($masterTable , $r);
        }
        $w2grid->outputJSON($data);

        break;
    default:
        $res = Array();
        $res['status']  = 'error';
        $res['message'] = 'Command "'.$_REQUEST['cmd'].'" is not recognized.';
        $res['postData']= $_REQUEST;
        $w2grid->outputJSON($res);
        break;
}