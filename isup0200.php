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
$mtran   = $_REQUEST['param']['tran'];
$mtrlst  = $_REQUEST['param']['trlst'];
$msort   = $_REQUEST['param']['sort'];

$paperSize=(empty($_REQUEST['config']['paper'])?"A4P":$_REQUEST['config']['paper']);
$maxRows  =(empty($_REQUEST['config']['rows' ])?  40 :0+$_REQUEST['config']['rows']);
$maxRows  =(empty($maxRows)?40:0+$maxRows);
$headTitle="託工入庫帳款統計表";
$headLeft ="月份:" . $myymm ;
$headRight="製表日期: ~~today~~ ";
$cols = array(
   array("field"=>"cust_no" , "text"=>"廠商編號", "width"=>"80px" )
  ,array("field"=>"cust_na" , "text"=>"廠商簡稱", "foot"=>"小計/平均")
  ,array("field"=>"tel1"    , "text"=>"廠商電話" )
  ,array("field"=>"amt"     , "text"=>"進貨金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"amt1"    , "text"=>"退貨金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"amts"    , "text"=>"合計金額","class"=>"right", "format"=>"n:2", "foot"=>"sum")
  ,array("field"=>"remark"    , "text"=>"備註"    ,"class"=>"right", "format"=>"n:2", "width"=>"40px")
);
//$footLeft = "製表日期: ~~today~~ ";
$footRight= "第 ~~curpg~~ ／ ~~pages~~ 頁";
$sql= "SELECT yymm,cust_no , SUM(amt) amt, SUM(amt1) amt1, SUM(amt)-SUM(amt1) amts
  , venm0100.cust_abbr cust_na , venm0100.tel1 , venm0100.fsn
  FROM(
  (SELECT yymm,cust_no, SUM(amt) amt,0 amt1 FROM isuh0100
  	WHERE  amt>0
  	AND yymm='$myymm'
  	GROUP BY yymm,cust_no)
  UNION
  (SELECT yymm,cust_no, 0 amt, SUM(amt)*-1 amt1 FROM isuh0100
  	WHERE amt<0
  	AND yymm='$myymm'
  	GROUP BY yymm,cust_no)
  ) isu
  LEFT OUTER JOIN venm0100 USING(cust_no)
  GROUP BY yymm,cust_no,cust_na,tel1
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
  $sqlsum = "SELECT SUM(amt) amt , SUM(amt1) as amt1 , SUM(amts) as amts FROM ($sql) AS just_sum";
  $dsum = array();
  if( !($db1->dbQuery($sqlsum)) ) {
    $db1->dbErrMsg(true);
  } else {
    $dsum=$db1->dbRead();
  }
}
// 新增或更新應付帳款
if (!empty($data) && $mtran="Y") {
  $tbl = 'vrcm0100';
  foreach ($data as $row) {
    $mcust_no = $row['cust_no'];
    $taxrate = (empty($row['fsn']) ? 0 : 5);
    $wrkamt=round($row['amt'],0);
    $wrkbad=round($row['amt1'],0);;
    $salamt = $wrkamt - $wrkbad;
    $taxamt = round($salamt * $taxrate / 100,0);
    $sqlw = "yymm='$myymm' AND cust_no='$mcust_no'";
    $sqlf = "SELECT autoid, yymm , cust_no , flag , lst_amt , rec_amt FROM $tbl WHERE $sqlw LIMIT 1";
    $mautoid=0;
    $mflag="";
    if ($db1->dbQuery($sqlf)) {
      $r = $db1->dbRead(0);
      $mautoid=$r['autoid'];
      $mflag=$r['flag'];
      $lstamt=round($r['lst_amt'],0);
      $recamt=$r['rec_amt'];
    }
    if (empty($mautoid)) {
      $lstamt = 0;
      // 前期餘額 lst_amt
      if ($mtrlst=='Y') {
        $sqll = "SELECT bln_rec bln_amt FROM $tbl WHERE cust_no='$mcust_no' AND yymm<'$myymm' ORDER BY yymm DESC LIMIT 1";
        if ($db1->dbQuery($sqll)) {
          $rl =$db1->dbRead(0);
          $lstamt = $rl['bln_amt'];
        }
      }
      $blnamt = $lstamt + $salamt + $taxamt;
      $blnrec = $blnamt ;
      $sql = "INSERT INTO $tbl(yymm,cust_no ,wrk_amt , wrk_bad , sal_amt , tax_rate , tax_amt , lst_amt , bln_amt, bln_rec)
                        VALUES ('$myymm','$mcust_no', $wrkamt , $wrkbad , $salamt , $taxrate , $taxamt, $lstamt , $blnamt, $blnrec)";
    } else if (empty($mflag) || $mflag=' ') {
      $blnamt = $lstamt + $salamt + $taxamt;
      $blnrec = $blnamt - $recamt;
      $sql = "UPDATE $tbl SET wrk_amt=$wrkamt , wrk_bad=$wrkbad , sal_amt=$salamt , tax_amt=$taxamt, bln_amt=$blnamt , bln_rec=$blnrec
        WHERE autoid=$mautoid";
    } else $sql="";
    //echo "\n<br>$myymm,$mcust_no,$mautoid,$mflag,sql:".$sql;
    if (!empty($sql)) {
      $db1->dbExecute($sql);
    }
  }


}
include "tmpl_report1.php";
//echo $sql;
?>