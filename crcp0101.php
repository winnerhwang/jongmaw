<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mbgn_ym = $_REQUEST['range']['bgn_ym'];
$mend_ym = $_REQUEST['range']['end_ym'];
$mrecf   = $_REQUEST['param']['recf'];
$musdtwd = $_REQUEST['param']['usdtwd'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="應收帳款明細表";
$headLeft ="月份:" . $mbgn_ym . " -> ".$mend_ym ;
$headRight="收款條件:" . $mrecf . "." . ($mrecf=="1"?"未收":"全部");
$cols = array(
//  ,array("field"=>"doc_no" , "text"=>"出貨單號" , "foot"=>"小計/平均")
   array("field"=>"date"   , "text"=>"交易日"   , "format"=>"d:m/d" , "width"=>"50px"  )
  ,array("field"=>"cust_no", "text"=>"客戶"     , "width"=>"60px", "foot"=>"小計/平均")
  ,array("field"=>"cust_na", "text"=>"簡稱" )
  ,array("field"=>"usdtwd" , "text"=>"幣別"     , "width"=>"40px")
  ,array("field"=>"currate", "text"=>"滙率"     ,"class"=>"right", "format"=>"n:4" , "width"=>"50px")
  ,array("field"=>"usd_amt", "text"=>"外幣金額" ,"class"=>"right", "format"=>"n:2" , "foot"=>"sum")
  ,array("field"=>"sal_amt", "text"=>"交易金額" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"tax_amt", "text"=>"營業稅額" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"tot_amt", "text"=>"應收合計" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"tax_no" , "text"=>"發票號碼" , "width"=>"80px" )
  ,array("field"=>"rec_date","text"=>"收款日"   , "width"=>"50px", "format"=>"d:m/d"   )
  ,array("field"=>"rec_amt", "text"=>"收款金額" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"rec_dsc", "text"=>"收款折讓" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
  ,array("field"=>"bln_amt", "text"=>"未收金額" ,"class"=>"right", "format"=>"n:0" , "foot"=>"sum")
);
$footLeft = "製表日期: ~~today~~ ";
//$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sqlr= (($mrecf=="1")? " AND (outh0100.rec_f='' OR outh0100.rec_f='N')":"");
$sql= "SELECT outh0100.doc_no , outh0100.date , outh0100.cust_no
        , outh0100.amt-outh0100.dscnt sal_amt   , outh0100.taxamt tax_amt
        , outh0100.amt-outh0100.dscnt + outh0100.taxamt tot_amt
        , outh0100.tax_no , outh0100.car1 rec_date  , outh0100.cash rec_amt , outh0100.cash3p rec_dsc
        , outh0100.amt-outh0100.dscnt + outh0100.taxamt -outh0100.cash -outh0100.cash3p bln_amt
        , outh0100.usdtwd , outh0100.currate , outh0100.usd_amt
        , cusm0100.cust_abbr cust_na
        FROM  outh0100
        LEFT OUTER JOIN cusm0100 USING(cust_no)
        WHERE outh0100.yymm >= '$mbgn_ym' AND outh0100.yymm <= '$mend_ym' AND outh0100.usdtwd='$musdtwd' $sqlr
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
  $sqlsum = "SELECT SUM(sal_amt) as sal_amt , SUM(tax_amt) as tax_amt , SUM(tot_amt) as tot_amt
          , SUM(rec_amt) as rec_amt , SUM(rec_dsc) as rec_dsc , SUM(bln_amt) as bln_amt
          , SUM(usd_amt) as usd_amt
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