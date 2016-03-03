<?php
class dbclass {
//	var $dbHost = "localhost";
//	var $dbUser = "root";
//	var $dbPassword = "";
//	var $dbDB = "";
	var $dbCharacter = "UTF8";
//	var $dbDebug = true;
//	public static $dbHost = "192.168.2.50";
//	public static $dbPassword = "Passwell@DG";
//	public static $dbUser = "sa";
//	//public static $dbHost = "192.168.2.20";
//	//public static $dbPassword = "simis";
//	public static $dbDB = "pwm01n";
//	public static $dbCharacter = "UTF8";
//	public static $dbDebug = true;
	var $dbHost ;
	var $dbPassword ;
	var $dbUser ;
	var $dbDB ;
//	var $dbCharacter ;
	var $dbDebug = true;
	var $link;
	var $dbError;
	var $sql;
	var $result;
	var $numRows;
	var $curRow;
	var $dataRow;
	var $maxRows;
	var $fieldNames;
	var $fieldTypes;
	
	function dbclass($dbHost="localhost", $dbUser="root", $dbPassword="winner", $dbDB="jm", $dbDebug=false) {
		$this->dbHost = $dbHost;
		$this->dbUser = $dbUser;
		$this->dbPassword = $dbPassword;
		$this->dbDB = $dbDB;
		$this->dbDebug = $dbDebug;
	}
	function __destruct() {
		//$this->dbClose();
		//$this->dbErrMsg();
	}
	function dbErrMsg($show=false) {
		if ($show || (($this->dbDebug) && ($this->dbError))) {
      $errno=mysql_errno($this->link);
      $ertxt=mysql_error($this->link);
			echo "\n<BR>MySQL(".$errno.")".$ertxt."\n<br>". $this->dbError; //.$this->dbHost.$this->dbUser.$this->dbPassword;
    }
        session_start();
        $serror=  array(
        "Env"        => $_SERVER['SERVER_NAME'] ,
        "IP/User"    => $_SERVER['REMOTE_ADDR'] . "/" . $_SESSION["login_user"] ,
        //"timestamp"  => Date('Y/m/d H:i:s.u') ,
        "script"     => $_SERVER['PHP_SELF'] ,
        "request"    => $_REQUEST ,
        "SQL"        => str_replace(array("\r\n", "\n", "\r","\t")," ",$this->sql) ,
        );
        if ($this->dbError != '') {
          $serror["error"] = $this->dbError;
        } else {
          $serror["rowCount"] = $this->$numRows;
          $serror["fieldCount"] = -1;
        }

        // open a log file and write error
        $fhandle = fopen( 'log\errors'.date('Ymd').'.txt', 'a' );
        if($fhandle){
          fwrite( $fhandle, ",\"".Date('Y/m/d H:i:s.').rand(1,999)."\":".json_encode($serror)."\r\n" );
          fclose(( $fhandle ));
         }
	}
	function dbConnect() {
		//echo "$this->dbHost, $this->dbUser, $this->dbPassword, $this->dbDB" ;
		if ($this->link) return $this->link; //$this->dbClose();
		if (!($this->link = mysql_connect($this->dbHost, $this->dbUser, $this->dbPassword))) {
			$this->dbError = "Error Connect ". $this->dbHost;
			$this->dbErrMsg();
			$this->dbClose();
		} else {
			if (!mysql_select_db($this->dbDB,$this->link)) {
				$this->link = null;
				$this->dbError = "Error Select DB ". $this->dbDB;
        $this->dbErrMsg();
			} else {
				//mysql_query("SET CHARACTER SET ".$this->dbCharacter);
        mysql_set_charset($this->dbCharacter,$this->link);
			}
		}
    //echo $this->dbHost, $this->dbUser, $this->dbPassword, $this->dbDB; 
        //echo         $this->dbCharacter;
        //echo mysql_character_set_name($this->link);

		return $this->link;
	}
	
	function dbClose() {
		if (!$this->link) return false;
		@mysql_close($this->link);
		$this->link =null;
	}
	
	function dbFind($table, $where="") {
		if (empty($where)) $this->sql = "SELECT * FROM $table";
		else $this->sql = "SELECT * FROM $table WHERE $where";
		$this->dbQuery($this->sql);
		return ($this->numRows>0);
	}
	
	function dbExecute($sql) {
		$this->sql = $sql;
		if (!$this->link) $this->dbConnect();
		if (!$this->link) {
			$this->dbError = "Error link when Execute ". $this->sql;
			$this->dbErrMsg();
			return false;
		}
		if (($this->result = mysql_query($this->sql,$this->link))) {
      return true;
		} else {
			$this->dbError = "Error Execute ". $this->sql;
			$this->dbErrMsg();
      return false;
		}
	}	
	
	function dbQuery($sql) {
		$this->sql = $sql;
		if (!$this->link) $this->dbConnect();
		if (!$this->link) {
			$this->dbError = "Error Query ". $this->sql;
			$this->dbErrMsg();
			return false;
		}
		if (($this->result = mysql_query($this->sql,$this->link))) {
			$this->numRows=@mysql_num_rows($this->result);
			if ($this->dbDebug) {
				$this->dbError = "Query Rows : $this->numRows\n$this->sql";
				$this->dbErrMsg();
			}
			if ($this->numRows>0) {
				$this->dbRead(0);
				mysql_data_seek($this->result, 0);
			}
			return true;
		} else {
			$this->dbError = "Error Query ". $this->sql;
			$this->dbErrMsg();
		}
		return false;
	}
	
	function dbRead($recno=-1) {
		if (!$this->result) $this->dbFind($this->sql, $this->link);
		if ($this->numRows<=0 || $recno>=$this->numRows) 	return null;
		if ($recno>=0)	mysql_data_seek($this->result, $recno);
		$this->dataRow = mysql_fetch_array($this->result);
		return $this->dataRow;
	}
	
	function dbNumFields() {
		return (mysql_num_fields($this->result));
	}
	
	function dbFetchField( $seq) {
		return (mysql_fetch_field($this->result, $seq));
	}
	
	function dbFieldNames() {
		for ($i=0; $i<$this->dbNumFields(); $i++) {
			$fld = $this->dbFetchField($i);
			$this->fieldNames[$i] = $fld->name;
			$this->fieldTypes[$fld->name] = $fld->type;
		}
		return ($this->fieldNames);
	}
	
	function ComboBox($cb_name,$table_name,$fldVal,$fldTxt,$where="",$order_by="",$asc="",$css_class="",$id="", $disa=true, $onevent="") {
		if ($table_name) {
			if ($id) 	$disable = ($disa?" disabled ":"");
			if ($where) 	$where = " WHERE ".$where." ";
			if ($order_by) 	$order_by = " ORDER BY ".$order_by." ".$asc;
			if ($css_class)	 $css_class = "class='$css_class'";
			$this->sql = "SELECT `$fldVal`,`$fldTxt` FROM `".$table_name."`".$where.$order_by;
			$this->dbQuery($this->sql);
			$showComboBox = ""
				."<select name='$cb_name' id='$cb_name' $css_class $disable $onevent> \n";
				//."<option value='0'>Select</option>\n";
			while ($row = $this->dbRead(-1)) {
				$selection = "";
				if($id){
					if($row[$fldVal] == $id){
						$selection = " selected ";
					}
				}
				$showComboBox .= ""
					."<option value='$row[$fldVal]' $selection>"
					.UchtToLang($row[$fldTxt])
					."</option>\n";
			} // End WHILE
			$showComboBox .= "\n</select>\n";
			mysql_free_result($this->result);
		} // End if ($table_name)
		return $showComboBox;
	} // End function Combo_Box
}
?>