<?php
include "dailybackup.php" ;
$opdir = '../phpMyBackupPro/export';
echo $opdir;
if ($handle = opendir($opdir)) {
    echo "Directory handle: $handle\n";
    echo "<br>Files:\n";
  $bkfile='';
  $mtime=filemtime($opdir);
    /* This is the correct way to loop over the directory. */
    while (false !== ($file = readdir($handle))) {
      //if (pathinfo($opdir."/".$file, PATHINFO_EXTENSION)=='zip') {
        echo "<br>$file\n";
        echo " modified: " . date("Y/m/d H:i:s.", filemtime($opdir."/".$file));
        echo " ext:".  pathinfo($opdir."/".$file, PATHINFO_EXTENSION);
        if (date("Y/m/d H:i:s.", filemtime($opdir."/".$file)> $mtime)) {
          $bkfile = $file;
          $mtime  = date("Y/m/d H:i:s.", filemtime($opdir."/".$file));
        }
      //}
    }

    closedir($handle);
  echo ("Location: $opdir/$bkfile"); // Redirecting To backup file
  header("Location: $opdir/$bkfile"); // Redirecting To backup file
}

?>