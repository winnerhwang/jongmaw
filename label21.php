<?php
if (empty($data)){
$data=array(
   array("AAA","223","FDSFSFASDFASDFF")
  ,array("BBBB","98731","XSChDFGHBV4")
  ,array("CCCC","698713","8XSCDFGHB5V")
  ,array("DDDD","194873","aXSCDxFG1HBV#")
);
}
$rpt['headTitle']=(!empty($headTitle)?$headTitle:"報表-label21");
$rpt['paperSize']=(!empty($paperSize)?$paperSize:"A4P");
$rpt['topMargin']['height']=(!empty($topMargin)?$topMargin:10);
$rpt['leftMargin']['width']=(!empty($leftMargin)?$leftMargin:20);
$rpt['horiDeli']['width']=(!empty($horiDeli)?$horiDeli:30);
$rpt['vertDeli']['height']=(!empty($vertDeli)?$vertDeli:40);
$rpt['label']['width']=(!empty($labelWidth)?$labelWidth:320);
$rpt['label']['height']=(!empty($labelHeight)?$labelHeight:96);
$rpt['item']['maxCols']=(!empty($maxCols)?$maxCols:2);
$rpt['item']['maxRows']=(!empty($maxRows)?$maxRows:10);
$rpt['item']['label']="";

genLabel("html-head",$rpt);
$rpt['item']['curRow']=0;
foreach($data as $d) {
  if ($rpt['item']['curRow']==0) {
    genLabel("top-margin",$rpt);
    $rpt['item']['curRow']++;
  }
  genLabel("left-margin",$rpt);
  $rpt['item']['label']="";
  foreach ($d as $l) {
    $rpt['item']['label'] .= ( empty($rpt['item']['label']) ? "" : "\n<br>" ) . $l;
  }
  for ($rpt['item']['curCol']=1; $rpt['item']['curCol']<=$rpt['item']['maxCols']; $rpt['item']['curCol']++) {
    genLabel("print-label",$rpt);
    if ($rpt['item']['curCol']< $rpt['item']['maxCols']) {
      genLabel("hori-deli",$rpt);
    }
  }
  if ($rpt['item']['curRow'] < $rpt['item']['maxRows']) {
    genLabel("vert-deli",$rpt);
    $rpt['item']['curRow']++;
  } else {
    genLabel("next-page",$rpt);
    $rpt['item']['curRow']=0;
  }
}
if ($rpt['item']['curRow']>0) genLabel("next-page",$rpt);
genLabel("html-end",$rpt);

function genLabel($optr,$rpt) {
//global $rpt['item']['curCol'], $rpt['item']['curRow'];
switch ($optr)  {
  case "html-head":
  $thiscss = str_ireplace(".php",".css",$_SERVER['PHP_SELF']);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="generator" content="winner huang">
  <title><?php echo $rpt['headTitle'];?></title>
  <link type="text/css" rel="stylesheet" href="label1.css">
  <style type="text/css" rel="stylesheet">
    div.topMargin {float:none; width:10px; height:<?php echo $rpt['topMargin']['height'];?>px; }
    div.leftMargin{float:left; width:<?php echo $rpt['leftMargin']['width'];?>px; height:10px; }
    div.horiDeli  {float:left; width:<?php echo $rpt['horiDeli']['width'];?>px; height:10px; }
    div.vertDeli  {float:none; width:10px; height:<?php echo $rpt['vertDeli']['height'];?>px; clear:both}
    div.label     {float:left; width:<?php echo $rpt['label']['width'];?>px; height:<?php echo $rpt['label']['height'];?>px; background-color:#fff; padding:0px; }
  </style>
  <link type="text/css" rel="stylesheet" href="<?php echo $thiscss;?>">
  <script src="/jquery/jquery-2.1.1.min.js"></script>
  <script src="/jquery/jtable/jquery.battatech.excelexport.js"></script>
  <script type="text/javascript">
    $(document).ready(function() {
        $("#expExcel").click(function () {
          $("div#printData>*").clone().appendTo( $("div#xlsData") );
          $("div#xlsData").btechco_excelexport({  containerid: "xlsData" , datatype: $datatype.Table });
          $("div#xlsData>*").remove();
        } );
    });
  </script>
  </head>
  <body>
    <div id="expExcel" class='expExcel dontPrint'>EXCEL</div>
    <div id='xlsData' class='dontDisplay'></div>
    <div id='printData'>
<?php
    break;
  case "top-margin":
?>
      <div class='page pageEject <?php echo $rpt['paperSize'];?>'>
        <div class='topMargin'></div>
<?php
    break;
  case "left-margin":
?>
          <div class='leftMargin'></div>
<?php
    break;
  case "print-label":
?>
            <div class='label'>
                 <?php
                 echo $rpt['item']['label'];
                 ?>
            </div>
<?php
    break;
  case "hori-deli":
?>
            <div class='horiDeli'></div>
<?php
    break;
  case "vert-deli":
?>
          <div class='vertDeli'></div>
<?php
    break;
  case "next-page":
?>
      </div>
<?php
    break;
  case "html-end":
?>
    </div>
  </body>
</html>
<?php
    break;
  default:
    break;
} }
?>