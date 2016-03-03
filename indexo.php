<?
$headTitle="忠懋企業ＭＩＳ資訊管理系統網頁版";
$inc_jtable=false;
$inc_excelExport=true;
$inc_tabs=true;
$onLoad=false;
session_start();
$loginuser=$_SESSION["login_user"];
include "inc_mysql.php";
if (empty($loginuser)) {
  include "inc_loginCheck.php";
}

include "inc_head.php";

?>
<!--div id='bg1' class='bg1'></div-->
<div id='headTitle' class='headTitle'>
<h1 align=center><?echo $headTitle;?></h1>
</div>
<?
if (empty($loginuser)) {
   include "inc_loginForm.php";

} else {
   include "inc_menu.php";

}
//echo "session:";
//echo      $_SESSION['login_user'];
//echo      $_SESSION['login_pass'];
//echo      $_SESSION['login_name'];
//echo      $_SESSION['login_mgrp'];
?>
<div id="content">
</div>
<?
include "inc_foot.php"
?>