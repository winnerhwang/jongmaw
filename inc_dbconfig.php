<?php
$DBMODULE = "mssql";
// echo phpversion();
// echo $DBMODULE;
// echo phpversion($DBMODULE);
//if ($_SESSION['userid']=="winner") $DBMODULE = "sqlite";
if ($DBMODULE == "mssql")	{
	include "inc_mssql.php";
	dbclass::$dbHost = "192.168.2.50";
	dbclass::$dbUser = "sa";
	//dbclass::$dbPassword = "Passwell@DG";
	dbclass::$dbPassword = "simis";
	//dbclass::$dbHost = "192.168.2.20";
	//dbclass::$dbUser = "sa";
	//dbclass::$dbPassword = "simis";
	dbclass::$dbDB = "pwm01n";
	dbclass::$dbCharacter = $langCode; //"UTF8";
	dbclass::$dbDebug = true;
} else if ($DBMODULE == "mysql")	{
	include "inc_mysql.php";
	dbclass::$dbHost = "localhost";
	dbclass::$dbUser = "root";
	dbclass::$dbPassword = "winner";
	dbclass::$dbDB = "hye_ea";
	dbclass::$dbCharacter = $langCode; //"UTF8";
	dbclass::$dbDebug = true;
} else if ($DBMODULE == "sqlite")	{
	include "inc_sqlite.php";
	dbclass::$dbFile = "hye.db";
	dbclass::$dbMode = 0666;
	
}
if (!$db1) $db1 = new dbclass();
function dbModule() {
	global $DBMODULE;
	return $DBMODULE;
}
?>