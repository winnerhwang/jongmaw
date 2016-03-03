<?php
include "dailybackup.php";

if ($handle = opendir('../phpMyBackupPro/export') ) {
    echo "Directory handle: $handle\n";
    echo "Files:\n";

    /* This is the correct way to loop over the directory. */
    while (false !== ($file = readdir($handle))) {
        echo "$file\n";
    }

    /* This is the WRONG way to loop over the directory. */
    while ($file = readdir($handle)) {
        echo "$file\n";
    }

    closedir($handle);
}

?>