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
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="薪資月總表";
$headLeft ="月份:" . $myymm ;
$headRight="第 ~~curpg~~ ／ ~~pages~~ 頁";
$cols = array(
   array("field"=>"emp_na", "text"=>"姓名", "foot"=>"小計/平均","width"=>70)
  ,array("field"=>"base"  , "text"=>"本薪"  ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"plus1" , "text"=>"假加班","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"plus2" , "text"=>"晚加班","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"plus3" , "text"=>"津貼"  ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"plus4" , "text"=>"工作獎","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"plus7" , "text"=>"全勤額","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus2" , "text"=>"扣缺席","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus9" , "text"=>"扣其他","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"amtp"  , "text"=>"應發額","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus1" , "text"=>"借支"  ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus3" , "text"=>"所得稅","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus4" , "text"=>"勞保費","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"mnus5" , "text"=>"健保費","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"amt"   , "text"=>"實領額","class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"remark", "text"=>"備註"  ,"width"=>100  )
);
$footLeft = "董事長:  ";
$footMiddle="總經理: 　　　　　　　　　　　　 製表: ";
$footRight= "製表日期: ~~today~~ ";
$sql= "SELECT srym0100.yymm , srym0100.emp_no , srym0100.base
        , srym0100.adddd , srym0100.adddh , srym0100.addnd , srym0100.addnh
        , srym0100.hol1d , srym0100.hol1h , srym0100.hol2d , srym0100.hol2h
        , srym0100.plus1 , srym0100.plus2 , srym0100.plus3 , srym0100.plus4 , srym0100.plus5
        , srym0100.plus6 , srym0100.plus7 , srym0100.plus8 , srym0100.plus9
        , srym0100.mnus1 , srym0100.mnus2 , srym0100.mnus3 , srym0100.mnus4 , srym0100.mnus5 , srym0100.mnus9
        , srym0100.amt   , srym0100.remark
        , srym0100.base  + srym0100.plus1 + srym0100.plus2 + srym0100.plus3 + srym0100.plus4
        + srym0100.plus5 + srym0100.plus6 + srym0100.plus7 + srym0100.plus8 + srym0100.plus9
        - srym0100.mnus2 - srym0100.mnus9 as amtp
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
    $data[]=$row;
  }
  $sqlsum = "SELECT SUM(base) as base , SUM(amt) as amt  , SUM(amtp) as amtp
      , SUM(plus1) plus1 , SUM(plus2) plus2 , SUM(plus3) plus3 , SUM(plus4) plus4
      , SUM(plus5) plus5 , SUM(plus6) plus6 , SUM(plus7) plus7 , SUM(plus8) plus8 , SUM(plus9) plus9
      , SUM(mnus1) mnus1 , SUM(mnus2) mnus2 , SUM(mnus3) mnus3 , SUM(mnus4) mnus4 , SUM(mnus5) mnus5 , SUM(mnus9) mnus9
    FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }
}
$db1->dbClose();

include "tmpl_report1.php";
//echo $sql;
?>