<?php
include_once "inc_mysql.php";
$ErrMsg="";
$xname =( !empty($_REQUEST['username']) ? $_REQUEST['username'] : "");
$xpass =( !empty($_REQUEST['password']) ? $_REQUEST['password'] : "");
$xfcmd =( !empty($_REQUEST['cmd']) ? $_REQUEST['cmd'] : "");
if (!empty($_SESSION['login_user']))  $xname = $_SESSION['login_user'];
setcookie("login_mgrp","");
if (!empty($xfcmd))  {
  $xrecd = ( !empty($_REQUEST['record']) ? $_REQUEST['record'] : "");
  $xname = $xrecd['username'];
  $xpass = addslashes(htmlspecialchars(urldecode($xrecd['password'])));
  $xrecs = $xfcmd." rec=";
  foreach ($xrecd AS $kk => $dd) {$xrecs = $xrecs . $kk. "=" .$dd. "_";}
  $aMsg = array("status" => "error" , "message" => $xrecs  );
  //$aMsg = array(status => "success"  );
  //echo json_encode($aMsg);
  //return;
}
if (empty($xname) && empty($xpass) ) {
  $ErrMsg = "請輸入用戶代碼及密碼...";
} else {
  $ErrMsg="Check";
  $db1= new dbclass();
  if (!$db1->dbConnect()) {echo "無法連接資料庫"; return;};
  $sql="SELECT name,password,usr_name,menugroup FROM pass WHERE name='".$xname."' AND password='".$xpass."' ";
  if( $db1->dbQuery($sql) ) {
    if ($db1->numRows>0) {
      $row=$db1->dbRead();
      session_start();
      $_SESSION['login_user']=$row['name'];
      $_SESSION['login_pass']=$row['password'];
      $_SESSION['login_name']=$row['usr_name'];
      $_SESSION['login_mgrp']=$row['menugroup'];
      setcookie("login_user",$_SESSION['login_user'],time()+86400*7);
      setcookie("login_mgrp",$_SESSION['login_mgrp']);
      $ErrMsg=$row['usr_name']."登入成功".$db1->numRows;
      if ($xfcmd=="save-record") {
        echo json_encode(array("status" => "success", "message"=>$row['usr_name'] ));
      } else {
        header("location: ".$_SERVER['PHP_SELF']);
      }
    } else {
      $ErrMsg = "用戶代碼或密碼不正確..$sql.";
      $aMsg['status']="error";
      $aMsg['message'] = $ErrMsg;
      if ($xfcmd=="save-record") {      echo json_encode($aMsg); }
    }
  } else {
    $ErrMsg = "無法查驗...";
      $aMsg['message'] = $ErrMsg;
      $aMsg['status']="error";
    if ($xfcmd=="save-record") {      echo json_encode($aMsg); }
  }
  $db1->dbClose();
}
//echo "MSG:".$ErrMsg."SQL:".$sql;
?>
