<?php
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
if (empty($loginuser)) {
  return;
}
if (empty($_REQUEST['cmd'])) {
  return;
}
$mcust_no= (empty($_REQUEST['range']['cust_no'])?"":$_REQUEST['range']['cust_no']);
$mbgn_doc= $_REQUEST['range']['bgn_doc'];
$mend_doc= $_REQUEST['range']['end_doc'];
$mcust_fn= $_REQUEST['param']['cust_fn'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"Letter2":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  10 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?10:0+$maxRows);
$headTitle="忠懋企業股份有限公司<br>託工採購單";
$headLeft ="廠商:" . $_REQUEST['range']['cust_no'] ."-".$_REQUEST['param']['cust_fn']. " Tel:".$_REQUEST['param']['tel1'] . " Fax:".$_REQUEST['param']['fax'];
$headRight="製表日期: ~~today~~ " ;
$mtoaddr="";
$cols = array(
   array("field"=>"bom_no" , "text"=>"機種"     ,"width"=>60 )
  ,array("field"=>"stk_no" , "text"=>"零件料號" ,"width"=>65 )
  ,array("field"=>"stk_na" , "text"=>"零件名稱" ,"width"=>165)
  ,array("field"=>"spec"   , "text"=>"規格" )
  //,array("field"=>"mtrl"   , "text"=>"原料說明" ,"width"=>80 )
  ,array("field"=>"qty"    , "text"=>"數量"     ,"width"=>60 ,"class"=>"right", "format"=>"n:0" )
  ,array("field"=>"unit"   , "text"=>" "     ,"width"=>20 )
  ,array("field"=>"date1"  , "text"=>"交貨日期" ,"width"=>80  )                  // , "format"=>"d:Y/m/d"
  ,array("field"=>"doc_no" , "text"=>"訂購單號" ,"width"=>85 )
);
$footLeft = "<div class='font12'>備註：1.本公司統一編號:22511771 發票地址:嘉義縣太保市過溝里瓦厝43-2號 Tel:05-2370222 Fax:05-2378122"
     ."\n<BR>　　　2.廠商接到本訂單後，請負責人於右下方『廠商簽章』欄簽章後傳真至本公司給採購人員以示負責。"
     ."\n<BR>　　　3.請照訂購單填寫進料單，一定要把訂購單號及料號品名寫出，否則無法請款。"
     ."\n<BR></div>"
     ."\n<BR>　　　核准:　　　　　　　　　　　　採購員:　　　　　　　　　　　　廠商簽章:";
//$footMiddle=(empty($mcust_no)?"": "過濾客戶:".$mcust_no." - ".$_REQUEST['param']['cust_na']);
$footRight= "~~curpg~~ / ~~pages~~ 頁";
//$sqlc= (empty($mcust_no)?"": " AND outh0100.cust_no='".$mcust_no."' ");
$sql= "SELECT wrkm0100.date1 , wrkm0100.doc_no , wrkm0100.bom_no , wrkm0100.toaddr
        , wrkm0100.stk_no   , wrkm0100.qty
        , stkm0100.stk_namc stk_na , stkm0100.spec , stkm0100.mtrl, stkm0100.unitc unit
        FROM  wrkm0100
        LEFT OUTER JOIN stkm0100 USING(stk_no)
        WHERE wrkm0100.cust_no = '$mcust_no'
          AND wrkm0100.doc_no>='$mbgn_doc' AND wrkm0100.doc_no <= '$mend_doc'
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
    if (empty($mtoaddr) && !empty($row['toaddr'])) $mtoaddr=$row['toaddr'];
  }
/*  $sqlsum = "SELECT SUM(qty) as qty , SUM(ins_qty) as ins_qty , SUM(qty1) as qty1 FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  } */
}
$db1->dbClose();

if (!empty($mtoaddr)) $footLeft = "交貨地址：".$mtoaddr."\n<br>". $footLeft;
include "tmpl_report1.php";
//echo $sql;
?>