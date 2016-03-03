<?php
$headTitle="忠懋企業ＭＩＳ資訊管理系統網頁版";
$companyName = "忠懋企業股份有限公司";
$inc_jtable=false;
$inc_excelExport=true;
$inc_tabs=true;
$onLoad=false;
session_start();
$loginuser=(!empty($_SESSION["login_user"]) ? $_SESSION["login_user"] : "" );
$runModule=(!empty($_REQUEST["run_module"]) ? $_REQUEST["run_module"] : "" );
if (empty($runModule) && !empty( $_COOKIE["run_module"]) ) {$runModule =  $_COOKIE["run_module"];  $_SESSION["run_module"]=$runModule; }
if (empty($runModule) && !empty($_SESSION["run_module"]) )  $runModule = $_SESSION["run_module"];

include "inc_mysql.php";
if (empty($loginuser)) {
  include "inc_loginCheck.php";
}

include "inc_head.php";

?>
<div id='headTitle' class='headTitle'>
<h1 align=center><?php echo $headTitle;?></h1>
</div>
<?php
if (empty($loginuser)) {
   include "inc_loginForm.php";
} else {
   include "inc_menu.php";
}
?>

<div id="myLayout" >
</div>
<?php
if (!empty($loginuser) && !empty($runModule)) {
  echo "<script  type='text/javascript' src='".$runModule.".js'></script>";
}
include "inc_foot.php";
?>
