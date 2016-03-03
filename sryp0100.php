<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$myymm = $_REQUEST['range']['yymm'];
$mbgn_emp = $_REQUEST['range']['bgn_emp'];
$mend_emp = $_REQUEST['range']['end_emp'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  2  :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?2:0+$maxRows);
$maxCols  = 2;
$headTitle="薪資明細單";
$labelWidth = 320;
$labelHeight= 295;
$topMargin=20;
$vertDeli=50;
$horiDeli=60;
$sql= "SELECT srym0100.yymm , srym0100.emp_no , srym0100.base
        , srym0100.adddd , srym0100.adddh , srym0100.addnd , srym0100.addnh
        , srym0100.hol1d , srym0100.hol1h , srym0100.hol2d , srym0100.hol2h
        , srym0100.plus1 , srym0100.plus2 , srym0100.plus3 , srym0100.plus4 , srym0100.plus5
        , srym0100.plus6 , srym0100.plus7 , srym0100.plus8 , srym0100.plus9
        , srym0100.mnus1 , srym0100.mnus2 , srym0100.mnus3 , srym0100.mnus4 , srym0100.mnus5 , srym0100.mnus9
        , srym0100.amt   , srym0100.remark
        , empm0100.emp_name emp_na  , empm0100.bank , empm0100.acc
        FROM  srym0100
        LEFT OUTER JOIN empm0100 USING(emp_no)
        WHERE srym0100.yymm = '$myymm'
          AND srym0100.emp_no >= '$mbgn_emp' AND srym0100.emp_no <= '$mend_emp'
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
    $data[]=lableData($row);
  }
/*  $sqlsum = "SELECT SUM(qty) as qty , AVG(price) as price , SUM(amt) as amt FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }  */
}
$db1->dbClose();
include "label21.php";
//echo $sql;

function lableData($rcd) {
//  ob_start();
//.sprintf("<tr><td>郵局:</td><td>%s</td><td>&nbsp;</td><td>帳號:</td><td>%s</td></tr>" ,$rcd['bank'] ,$rcd['acc'])
$record=array(
 sprintf("<table width=100%% cellspacing=0><caption>忠懋企業股份有限公司<br>薪資明細單</caption><tbody class='font14 right' >")
.sprintf("<tr><td>姓名:</td><td>%s</td><td>&nbsp;</td><td>月份:</td><td>%s</td></tr>" , $rcd['emp_na'] , $rcd['yymm'])
.sprintf("<tr><td>假日加班:</td><td> %3d 天 %3d時</td><td>&nbsp;</td><td>晚間加班:</td><td> %3d 天 %3d時</td></tr>" ,$rcd['adddd'] ,$rcd['adddh'] ,$rcd['addnd'] ,$rcd['addnh']  )
.sprintf("<tr><td>給薪休假:</td><td> %3d 天 %3d時</td><td>&nbsp;</td><td>無薪休假:</td><td> %3d 天 %3d時</td></tr>" ,$rcd['hol1d'] ,$rcd['hol1h'] ,$rcd['hol2d'] ,$rcd['hol2h'] )
.sprintf("<tr><td>本薪:</td><td>%10d</td><td>&nbsp;</td><td> </td><td> </td></tr>" ,$rcd['base'])
.sprintf("<tr><td>加給項目</td><td>加給金額</td><td>&nbsp;</td><td>扣款項目</td><td>扣款金額</td></tr>")
.sprintf("<tr><td>假日加班:</td><td>%10d</td><td>&nbsp;</td><td>借    支:</td><td>%10d</td></tr>" ,$rcd['plus1'] ,$rcd['mnus1'])
.sprintf("<tr><td>晚間加班:</td><td>%10d</td><td>&nbsp;</td><td>缺席扣款:</td><td>%10d</td></tr>" ,$rcd['plus2'] ,$rcd['mnus2'])
.sprintf("<tr><td>津    貼:</td><td>%10d</td><td>&nbsp;</td><td>所 得 稅:</td><td>%10d</td></tr>" ,$rcd['plus3'] ,$rcd['mnus3'])
.sprintf("<tr><td>工作獎金:</td><td>%10d</td><td>&nbsp;</td><td>勞 保 費:</td><td>%10d</td></tr>" ,$rcd['plus4'] ,$rcd['mnus4'])
.sprintf("<tr><td>全勤獎金:</td><td>%10d</td><td>&nbsp;</td><td>健 保 費:</td><td>%10d</td></tr>" ,$rcd['plus7'] ,$rcd['mnus5'])
.sprintf("<tr><td>其他加給:</td><td>%10d</td><td>&nbsp;</td><td>其他扣款:</td><td>%10d</td></tr>" ,$rcd['plus9'] ,$rcd['mnus9'])
.sprintf("<tr><td>實領金額:</td><td>%10d</td><td>&nbsp;</td><td> </td><td> </td></tr>" ,$rcd['amt'] )
.sprintf("<tr><td>備註:</td><td colspan=4 class='left'>%s</td></tr>" ,$rcd['remark']  )
.sprintf("</tbody></table>" )
);
//ob_end_clean();
return $record;
}
?>