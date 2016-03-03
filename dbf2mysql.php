<?php
ini_set("max_execution_time", "300");
$tb = (!empty($_REQUEST['tb']) ? $_REQUEST['tb'] : "");
echo "<form>Table:<input tyep=text size=20 name=tb id=tb value='$tb'><input type=submit></form>";
if (empty($tb)) return;

$srcTable = $tb;
$dstTable = $srcTable;
include "inc_odbc.php";
include "inc_mysql.php";
$dbMysql = new dbclass();
$dbOdbc  = new dbOdbc();
$dbMysql->dbConnect();
$dbOdbc->dbConnect();
if ($dbOdbc->link) echo "\n<br>SOURCE $srcTable connected";
else echo "\n<br>Connect to ODBC-dbf error";
if ($dbMysql->link) echo "\n<br>TARGET $dstTable connected";
else echo "\n<br>Connect to MySql error";

$srcSql = "SELECT * FROM $srcTable";
//$ln=0;
if ( $dbOdbc->dbQuery($srcSql) ) {
  $flds = $dbOdbc->dbFieldNames();
  $flds = " (`".implode("`,`", $flds) . "`) ";
  while ( $row = $dbOdbc->dbRead() ) {
    $vals = "";
    //echo ",".$row['DOC_NO'];
    foreach ($row AS $k => $v) {
      $vals .= (empty($vals)?"(":",") . ((gettype($v)=="integer" || gettype($v)=="double"   || gettype($v)=="float"|| gettype($v)=="boolean") ?  $v :
      "'".addslashes(iconv("BIG5","UTF-8//TRANSLIT//IGNORE",$v)))."'";
    }
    $vals .= (!empty($vals)?")":"");
    $sqli = "INSERT INTO $dstTable $flds VALUES $vals ";
    //echo "\n<br>".$sqli;

    if (!$dbMysql->dbExecute($sqli)) $dbMysql->dbErrMsg(true);

  }

}
echo "\n<br>end";
?>