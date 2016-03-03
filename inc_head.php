<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="zh-tw">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="faicon64.ico" type="image/png">
<link rel=stylesheet type='text/css' href='ffcss.css'>
<link rel=stylesheet type='text/css' href='<?php echo str_ireplace(".php",".css",$_SERVER['PHP_SELF']);?>'>
<!-- link rel="stylesheet" href="/jquery/jquery-ui.min.css" /-->
<link rel="stylesheet" href="/jquery/w2ui.css">
<?php 	if ($inc_jtable) {	?>
<!-- Include one of jTable styles. -->
<!-- link href="/jquery/jtable/themes/metro/blue/jtable.min.css" rel="stylesheet" type="text/css" /-->
<!-- link href="/jquery/jtable/themes/jqueryui/jtable_jqueryui.min.css" rel="stylesheet" type="text/css" /-->
<link href="/jquery/jtable/themes/lightcolor/gray/jtable.css" rel="stylesheet" type="text/css" />
<?php  }	?>
<title><?php echo $headTitle?></title>
<?php
if(strpos($_SERVER['HTTP_USER_AGENT'],'MSIE 6.0') !== false )
echo '<script  type="text/javascript" src="/jquery/jquery-1.11.1.min.js"></script>';
else
echo '<script  type="text/javascript" src="/jquery/jquery-2.1.1.min.js"></script>';
?>
<!-- script  type="text/javascript" src="/jquery/jquery-ui.min.js"></script /-->
<script  type="text/javascript" src="/jquery/w2ui.js"></script>
<script  type="text/javascript" src="<?php echo str_ireplace(".php",".js",$_SERVER['PHP_SELF']);?>"></script>
<?php 	if ($inc_jtable) {	?>
<!-- Include jTable script file. -->
<script src="/jquery/jtable/jquery.jtable.js" type="text/javascript"></script>
<script type="text/javascript" src="/jquery/jtable/localization/jquery.jtable.zh-TW.js"></script>
<?php  }
if ($inc_excelExport) {
?>
    <script src="/jquery/jtable/jquery.battatech.excelexport.js"></script>
<?php  }
if ($inc_tabs) {
?>
	<link type="text/css" rel="stylesheet" href="/jquery/dynatabs-master/tabs.css">
	<script type="text/javascript" src="/jquery/dynatabs-master/tdi.tabs.js"></script>
<?php  }
?>
<script src="/jquery/date.format.js" type="text/javascript"></script>
<script src="/jquery/jquery.cookie.js" type="text/javascript"></script>
<script src="winnerlib.js" type="text/javascript"></script>
</head>
<body <?php echo ($onLoad?"onload='".$onLoad."'":"")?> >
