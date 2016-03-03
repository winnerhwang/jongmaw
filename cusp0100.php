<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbgn_cus = $_REQUEST['range']['bgn_cus'];
$mend_cus = $_REQUEST['range']['end_cus'];
$mcuslist = $_REQUEST['param']['cuslist'];
$maddrx   = $_REQUEST['param']['addrx'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  2  :0+$_REQUEST['config']['rows']);
$maxCols  =(empty($_REQUEST['config']['cols' ])?  1  :0+$_REQUEST['config']['cols']);
$maxRows  =(empty($maxRows)?2:0+$maxRows);
$maxCols  =(empty($maxCols)?1:0+$maxCols);
$headTitle="客戶地址標籤";
$labelWidth = 320;
$labelHeight= 295;
$topMargin=20;
$vertDeli=50;
$horiDeli=60;
if (empty($mcuslist))  $sqlwhere = " cusm0100.cust_no >= '$mbgn_cus' AND cusm0100.cust_no <= '$mend_cus' ";
else    $sqlwhere= " cusm0100.cust_no in ( '" . str_replace( "," , "','" ,$mcuslist) . "' ) ";
$sql= "SELECT cusm0100.cust_no , cusm0100.cust_name , cusm0100.co_addr1 , cusm0100.co_addr2 , cusm0100.co_addr3  , cusm0100.co_addr4
        , cusm0100.boss , cusm0100.contact  , cusm0100.tel1
        FROM  cusm0100
        WHERE  $sqlwhere
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
    if (empty($row['boss'])) {
      if (empty($row['contact']))
        $boss="";
      else { $boss=$row['contact'];}
    } else { $boss=$row['boss'];}
    if (!empty($row[$maddrx])) $data[]=lableData($row, $boss, $maddrx);
  }
}
$db1->dbClose();
include "label1.php";
//echo $sql;

function lableData($rcd , $boss , $addrx) {
//  ob_start();
//.sprintf("<tr><td>郵局:</td><td>%s</td><td>&nbsp;</td><td>帳號:</td><td>%s</td></tr>" ,$rcd['bank'] ,$rcd['acc'])
$record=array(
 sprintf("<table width='100%%'>")
.sprintf("<tr><td class='lblname' colspan='2'>%s</td></tr>",$rcd['cust_name'])
.sprintf("<tr><td class='lbltel'>%s</td><td class='lblrec'>　收</td></tr>", $rcd['tel1'])
.sprintf("<tr><td class='lbladdr' colspan='2'>%s</td></tr></table>",$rcd[$addrx])
);
//ob_end_clean();
return $record;
}
?>