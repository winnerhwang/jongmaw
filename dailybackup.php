<?php
// This script was created by phpMyBackupPro 2.5 (http://www.phpMyBackupPro.net)
// In order to work probably, it must be saved in the directory D:/CoreAMP/htdocs/jm/sql/.
$_POST['db']=array("jm", );
$_POST['tables']="on";
$_POST['data']="on";
$_POST['drop']="on";
$_POST['zip']="zip";
$period=(3600*24)/24;
$security_key="aa4a4cbdd36cc0142d6cb06288e04ff7";
// switch to the phpMyBackupPro 2.5 directory
chdir("D:/CoreAMP/htdocs/phpMyBackupPro");
include("backup.php");
// switch back to the directory containing this script
chdir("D:/CoreAMP/htdocs/jm");
?>