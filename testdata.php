<?php
  $datalist =array(
    "total"=> 9,
    "records"=> array(
        array( "recid"=> 1, "fname"=> "John", "lname"=> "Doe", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 2, "fname"=> "Stuart", "lname"=> "Motzart", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 3, "fname"=> "Jin", "lname"=> "Franson", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 4, "fname"=> "Susan", "lname"=> "Ottie", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 5, "fname"=> "Kelly", "lname"=> "Silver", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 6, "fname"=> "Francis", "lname"=> "Gatos", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 7, "fname"=> "Mark", "lname"=> "Welldo", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 8, "fname"=> "Thomas", "lname"=> "Bahh", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" ),
        array( "recid"=> 9, "fname"=> "Sergei", "lname"=> "Rachmaninov", "email"=> "jdoe@gmail.com", "sdate"=> "4/3/2012" )
    )
  );
  echo json_encode($datalist);
?>