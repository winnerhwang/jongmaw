<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbgn_emp = $_REQUEST['range']['bgn_emp'];
$mend_emp = $_REQUEST['range']['end_emp'];
$memplist = $_REQUEST['param']['emplist'];
$maddrx   = $_REQUEST['param']['addrx'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  2  :0+$_REQUEST['config']['rows']);
$maxCols  =(empty($_REQUEST['config']['cols' ])?  1  :0+$_REQUEST['config']['cols']);
$maxRows  =(empty($maxRows)?2:0+$maxRows);
$maxCols  =(empty($maxCols)?1:0+$maxCols);
$headTitle="員工地址標籤";
$labelWidth = 320;
$labelHeight= 295;
$topMargin=20;
$vertDeli=50;
$horiDeli=60;
if (empty($memplist))  $sqlwhere = " empm0100.emp_no >= '$mbgn_emp' AND empm0100.emp_no <= '$mend_emp' ";
else    $sqlwhere= " empm0100.emp_no in ( '" . str_replace( "," , "','" ,$memplist) . "' ) ";
$sql= "SELECT empm0100.emp_no , empm0100.emp_name , empm0100.addr1 , empm0100.addr2
        FROM  empm0100
        WHERE $sqlwhere
        ORDER BY $msort ";
include "inc_mysql.php";
$db1 = new dbclass();
$lnk=$db1->dbConnect();
if (!$lnk) {
  $db1->dbErrMsg(true);
} else if( !($db1->dbQuery($sql)) ) {
  $db1->dbErrMsg(true);
} else {
  $data=array();
  while ($row=$db1->dbRead()) {
    if (!empty($row[$maddrx])) $data[]=lableData($row, $maddrx);
  }
}
$db1->dbClose();
include "label1.php";
//echo $sql;

function lableData($rcd , $addrx) {
//  ob_start();
//.sprintf("<tr><td>郵局:</td><td>%s</td><td>&nbsp;</td><td>帳號:</td><td>%s</td></tr>" ,$rcd['bank'] ,$rcd['acc'])
$record=array(
 sprintf("<table width='100%%'>")
.sprintf("<tr><td class='lblname'>%s</td></tr>",$rcd['emp_name'])
.sprintf("<tr><td class='lblrec'>先生/小姐　收</td></tr>")
.sprintf("<tr><td class='lbladdr'>%s</td></tr></table>",$rcd[$addrx])
);
//ob_end_clean();
return $record;
}
?>