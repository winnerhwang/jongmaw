<?php
include "inc_mysql.php";
$grp = $_REQUEST['grp'];
if (empty($grp)) $grp="0";
$db1= new dbclass();
$db1->dbConnect();
$sql="SELECT prgid,menutext FROM menu WHERE parent='' AND menugroup LIKE '%".$grp."%' ORDER BY menuno";
$node0 = array();
if ($db1->dbQuery($sql)) {
	while ($row=$db1->dbRead()) {
    $node0[$row['prgid']]=$row['menutext'];
  }
}
$nodes = array();
foreach ( $node0 AS $prg => $item) {
  $sql = "SELECT prgid,menutext FROM menu WHERE parent='".$prg."' AND menugroup LIKE '%".$grp."%' ORDER BY menuno";
  $node1=array();
  if ($db1->dbQuery($sql)) {
    while ($row=$db1->dbRead()) {
      $node1[]=array("id"=>$row['prgid'], "text"=>$row['menutext']);
    }
  }
  $nodes[] = array("id" => $prg, "text" => $item, "nodes"=>$node1 );
}
$db1->dbClose();
//print_r($nodes);
$aMneu=array("name"=>"sidebar", "style" => "font-size:1.5em;" , "nodes"=>$nodes);
echo json_encode($aMneu);

?>