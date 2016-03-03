<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$myyyy = $_REQUEST['range']['yyyy'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  3  :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?3:0+$maxRows);
$maxCols  = 1;
$headTitle="年度薪資印領明細表";
$labelWidth = 1020;
$labelHeight= 220;
$vertDeli = 1;
$horiDeli = 1;
$sql= "SELECT srym0100.yymm , srym0100.emp_no
        , srym0100.amt1  , srym0100.mnus3 , srym0100.food1
        , empm0100.emp_name emp_na  , empm0100.addr1 , empm0100.id_no
        FROM  srym0100
        LEFT OUTER JOIN empm0100 USING(emp_no)
        WHERE srym0100.yymm LIKE '$myyyy%'
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
    $data[]=$row;
  }
  $d = array();
  foreach ($data as $r) {
    $emp_no= $r['emp_no'];
    $mm    = substr($r['yymm'],-2);
    if (empty($d[$emp_no]))  {
      $d[$emp_no]=array('amt1'=>array(), 'mnus3'=>array(), 'food1'=>array(), 'emp_no'=>$r['emp_no'], 'emp_na'=>$r['emp_na'], 'addr1'=>$r['addr1'], 'id_no'=>$r['id_no'], );
    }
    $d[$emp_no]['amt1' ][$mm] = $r['amt1'];
    $d[$emp_no]['mnus3'][$mm] = $r['mnus3'];
    $d[$emp_no]['food1'][$mm] = $r['food1'];

  }
  //print_r($d);
  $data=array();
  foreach ($d as $e) {
    $data[]= labelData($e);
  }
}
$db1->dbClose();
include "label21.php";
//echo $sql;

function labelData($r) {
  ob_start();
global $myyyy;
$amt1 = 0;
foreach($r['amt1'] as $aa) {  $amt1 += $aa; }
$mnus3 = 0;
foreach($r['mnus3'] as $aa) {  $mnus3 += $aa; }
$food1 = 0;
foreach($r['food1'] as $aa) {  $food1 += $aa; }
$record=array(
 sprintf("<table width='100%%' class='font14' border='1px' cellspacing='0px' cellpadding='0px'><caption class='font16'>忠懋企業股份有限公司<br>%d年度薪資印領明細表</caption><tbody>", $myyyy)
.sprintf("<tr height='30px' class='center'><td>編號:</td><td>%s</td><td>姓名:</td><td colspan='2'>%s</td><td>戶籍地址:</td><td colspan='6'>%s</td><td class='font12'>身份証字號:</td><td colspan='2'>%s</td></tr>"
        , $r['emp_no'] , $r['emp_na'] , $r['addr1'] , $r['id_no'] )
.sprintf("<tr height='24px' class='center'><td width=80>月份:</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>%d月</td><td width=80>年終</td><td width=80>合計</td></tr>"
        ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,10 ,11 ,12 )
.sprintf("<tr height='24px' class='right'><td>薪資:</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td></tr>"
        ,$r['amt1']['01'] ,$r['amt1']['02'] ,$r['amt1']['03'] ,$r['amt1']['04'] ,$r['amt1']['05'] ,$r['amt1']['06'] ,$r['amt1']['07']
        ,$r['amt1']['08'] ,$r['amt1']['09'] ,$r['amt1']['10'] ,$r['amt1']['11'] ,$r['amt1']['12'] ,$r['amt1']['00'] ,$amt1 )
.sprintf("<tr height='24px' class='right'><td>所得稅:</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td></tr>"
        ,$r['mnus3']['01'] ,$r['mnus3']['02'] ,$r['mnus3']['03'] ,$r['mnus3']['04'] ,$r['mnus3']['05'] ,$r['mnus3']['06'] ,$r['mnus3']['07']
        ,$r['mnus3']['08'] ,$r['mnus3']['09'] ,$r['mnus3']['10'] ,$r['mnus3']['11'] ,$r['mnus3']['12'] ,$r['mnus3']['00'] ,$mnus3 )
.sprintf("<tr height='24px' class='right'><td>伙食費:</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td><td>%01d</td></tr>"
        ,$r['food1']['01'] ,$r['food1']['02'] ,$r['food1']['03'] ,$r['food1']['04'] ,$r['food1']['05'] ,$r['food1']['06'] ,$r['food1']['07']
        ,$r['food1']['08'] ,$r['food1']['09'] ,$r['food1']['10'] ,$r['food1']['11'] ,$r['food1']['12'] ,$r['food1']['00'] ,$food1 )
."<tr height='50px'><td>蓋章:</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>"
);
ob_end_clean();
return $record;
}
?>