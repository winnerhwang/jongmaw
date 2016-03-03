<?php
include "inc_mysql.php";
$db1 = new dbclass();
$lnk=$db1->dbConnect();
$fn = (!empty($_REQUEST['file']) ? $_REQUEST['file'] : "");
if (empty($fn)) {
  $sql = (!empty($_REQUEST['sql']) ? $_REQUEST['sql'] : "");
  echo "<form>SQL:<textarea rows=10 cols=100 name=sql id=sql >$sql</textarea><input type=submit></form>";
  if (!empty($sql)) {
      run_sql($sql);
  }
} else {
  echo "\n<br>open " . $_SERVER["DOCUMENT_ROOT"]. $fn ;
  $fp = fopen( $_SERVER["DOCUMENT_ROOT"]. $fn,"r");
  if ($fp)  {
    $slq="";
    $cnt = 0;
    echo "\n<br>running...";
    while (!feof($fp) )  {
      $ln = fgets($fp,4096);
      //echo "\n<br>LN: ".$ln;
      //if (substr($ln,-1)==";")
      //  $sql .= subs($ln,0,-1);
      //else {
      //  $sql .= $ln;
        //echo "\n<br>".$ln;
      $sql = $ln; //iconv("utf-8","big5",$ln);
        //echo "\n<br>".$sql;
        if (!(run_sql($sql)) ) {
          // "\n<br>Error:".$sql;
          //break;
        }
        $sql="";
      //}
    }
    echo $cnt;
  } else {echo "\n<br>".$fn." open error";}
  fclose($fp);
}
$db1->dbClose();


function run_sql($sql) {
  global $db1, $cnt;
      $cnt++;
      if( !($db1->dbExecute($sql)) ) {
        $db1->dbErrMsg(true);
        return false;
      };
  return true;
}
?>