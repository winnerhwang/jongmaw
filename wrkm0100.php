<?php
  ob_start();
  print_r($_REQUEST);
  $msg =  ob_get_contents();
  ob_end_clean();
require("w2db.php");
require("w2lib.php");
$db = new dbConnection("mysql");
$db->connect();
$masterTable ="wrkm0100";
$masterKey   ="doc_no";
//$slaveTable  ="outi0100";
//$slaveKey    ="autoid";
$xcmd = (!empty($_REQUEST['cmd'])? $_REQUEST['cmd'] : "");
if (empty($xcmd)) {
  if ($_REQUEST['search'])  {
    $xcmd="get-items";
  }
}

switch ($xcmd) {
    case 'get-records':
        $sql = "SELECT	wrkm0100.doc_no , DATE_FORMAT(wrkm0100.date,'%Y/%m/%d') as date
        , wrkm0100.cust_no , venm0100.cust_abbr cust_na
        , wrkm0100.stk_no  , stkm0100.stk_namc  stk_na
        , wrkm0100.qty     , wrkm0100.price     , wrkm0100.amt  , wrkm0100.ins_qty
	  FROM  (wrkm0100 LEFT OUTER JOIN venm0100 USING(cust_no))
                    LEFT OUTER JOIN stkm0100 USING(stk_no)"
              ." WHERE ~search~ ORDER BY ~sort~";
        $cql = "SELECT count(1) FROM wrkm0100 WHERE ~search~ ORDER BY ~sort~ ";
        $res = $w2grid->getRecords($sql, $cql, $_REQUEST);
        $w2grid->outputJSON($res);
        break;
    case 'delete-records':
        $res = $w2grid->deleteRecords($masterTable, $masterKey, $_REQUEST);
        $w2grid->outputJSON($res);
        if ($res['status']=='success' && !empty($sqld)) {            $res = $w2grid->updateSlave($sqld);        }
        break;
    case 'get-record':
        $sql = "SELECT	wrkm0100.doc_no , DATE_FORMAT(wrkm0100.date,'%Y/%m/%d') as date
        , wrkm0100.cust_no , venm0100.cust_abbr cust_na
        , wrkm0100.stk_no  , stkm0100.stk_namc  stk_na  , stkm0100.spec
        , wrkm0100.qty     , wrkm0100.price     , wrkm0100.amt  , wrkm0100.ins_qty
        , wrkm0100.wkt_no  , wktm0100.wkt_na
        , wrkm0100.bom_no  , wrkm0100.bom_ser
        , swkm0100.note
        , DATE_FORMAT(wrkm0100.date1,'%Y/%m/%d') as date1
        , wrkm0100.qty1      , wrkm0100.tocust  , wrkm0100.toaddr
	FROM ((((wrkm0100 LEFT OUTER JOIN venm0100 USING(cust_no) )
                    LEFT OUTER JOIN stkm0100 USING(stk_no) )
                    LEFT OUTER JOIN wktm0100 USING(wkt_no) )
                    LEFT OUTER JOIN swkm0100 ON   (wrkm0100.stk_no=swkm0100.stk_no AND wrkm0100.wkt_no=swkm0100.wkt_no) )
                    LEFT OUTER JOIN bomm0100 USING(bom_no) "
             ." WHERE ".$masterKey." = '".$_REQUEST['recid'] ."'" ;
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'save-record':
        $reqrec = $_REQUEST;
        //$reqrec['record']['cust_abbr']= $reqrec['record']['cust_no']['cust_abbr'];
        //$reqrec['record']['cust_no'  ]= $reqrec['record']['cust_no']['cust_no'];
        unset($reqrec['record']['cust_na']);
        unset($reqrec['record']['toabbr']);
        unset($reqrec['record']['stk_na']);
        unset($reqrec['record']['wkt_na']);
        unset($reqrec['record']['note']);
        $res = $w2grid->saveRecord($masterTable, $masterKey, $reqrec);
        if ($res['status']=='success' && !empty($sqlu)) {            $res = $w2grid->updateSlave($sqlu);        }
        $w2grid->outputJSON($res);
        break;
    case 'save-records':  // 重算已入量
        $sels = $_REQUEST['selected'];
        foreach ($sels as $wrk_no) {
          $sqlu = "UPDATE wrkm0100 SET ins_qty =
            (SELECT SUM(qty) FROM isui0100 WHERE wrk_no='$wrk_no' GROUP BY wrk_no)
           WHERE doc_no ='$wrk_no'";
          $res = $w2grid->updateSlave($sqlu);
        }
        $w2grid->outputJSON($res);
        break;
    case 'get-items':
        $reqSearch =  $_REQUEST['search'];
        $custno = $_REQUEST['cust_no'];
        if (strpos($reqSearch," | ")) {
          $reqSearch = substr($reqSearch,0,strpos($reqSearch," | "));
        }
        $sql  = "SELECT doc_no,CONCAT(stk_no,' | ',wkt_no,' | ',FORMAT(price,2),' | ',FORMAT(qty,0),' | ',FORMAT(ins_qty,0)) as stk FROM " . $masterTable
               ." WHERE cust_no='$custno' AND doc_no LIKE '". $reqSearch ."%' ORDER BY doc_no DESC LIMIT " . $_REQUEST['max'];
        $res = $w2grid->getItems($sql);
        $w2grid->outputJSON($res);
        break;
    case 'auto-no':
        $prefix = $_REQUEST['prefix'];
        $sql = "SELECT ".$masterKey." FROM ".$masterTable." WHERE ".$masterKey." LIKE '".$prefix."%' ORDER BY ".$masterKey." DESC LIMIT 1";
        $res = $w2grid->getRecord($sql);
        $w2grid->outputJSON($res);
        break;
    case 'open-item':
        $prefix = implode("",explode('/', $_REQUEST['opdate'], -1));
        $sql = "SELECT ".$masterKey." FROM ".$masterTable." WHERE ".$masterKey." LIKE '".$prefix."%' ORDER BY ".$masterKey." DESC LIMIT 1";
        $res = $w2grid->getRecord($sql);
        //print_r($res);
        if (count($res['record'])==0) {
          $nxtdoc = 1;
          $lstdoc = "0000";
        } else {
          $lstdoc = substr($res['record'][$masterKey], 6 ,3);
          $nxtdoc = $lstdoc + 1;
        }
        $ndocno = $prefix . substr( str_repeat("0",4).$nxtdoc , -3);

        $sql = "SELECT stk_no , ser_no , wkt_no , cust_no , price "
          ." FROM swkm0100 WHERE stk_no='".$_REQUEST['stk_no']."' AND ser_no NOT IN ('','*','**') ORDER BY ser_no";
        $res = $w2grid->getRecords($sql, null, $_REQUEST);
        $data = array();
        $data['status']  = "success";
        $data['total']  = $res['total'];
        $data['lstdoc'] = $prefix . $lstdoc;
        $data['records'] = array();
        foreach ($res['records'] as $r => $d) {
          $data['records'][$r] = array();
          $data['records'][$r]['doc_no'] = $ndocno  . (count($res['records'])>0 ? chr(ord('A')+$r) : "") ;
          $data['records'][$r]['date'] = $_REQUEST['opdate'];
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