<?php
class dbOdbc {
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
	//var $dsn = "Driver={Microsoft dBase Driver (*.dbf)};SourceType=DBF;SourceDB=D:\\JM;";

	function dbOdbc($dbHost="127.0.0.1", $dbUser="", $dbPassword="", $dbDB="jm", $dbDebug=false) {
    $dsn = "Driver={Microsoft dBASE Driver (*.dbf)};SourceType=DBF;DriverID=21;Dbq=D:\\JM;Exclusive=NO;collate=Machine;NULL=NO;DELETED=1;BACKGROUNDFETCH=NO;READONLY=false;";
		$this->dbHost = $dsn;
		$this->dbUser = $dbUser;
		$this->dbPassword = $dbPassword;
		$this->dbDB = $dbDB;
		$this->dbDebug = $dbDebug;
	}
	function __destruct() {
		//$this->dbClose();
		//$this->dbErrMsg();
	}
	function dbErrMsg() {
		if (($this->dbDebug) && ($this->dbError)) {
      $errno=odbc_errno($this->link);
      $ertxt=odbc_error($this->link);
			echo "\n<BR>odbc(".$errno.")".$ertxt."\n<br>". $this->dbError; //.$this->dbHost.$this->dbUser.$this->dbPassword;
    }
	}
	function dbConnect() {
		//echo "$this->dbHost, $this->dbUser, $this->dbPassword, $this->dbDB" ;
		if ($this->link) return $this->link; //$this->dbClose();
		if (!($this->link = odbc_connect($this->dbHost, $this->dbUser, $this->dbPassword))) {
			$this->dbError = "Error Connect ". $this->dbHost;
			$this->dbErrMsg();
			$this->dbClose();
		} else {
			//if (!odbc_select_db($this->dbDB,$this->link)) {
			//	$this->link = null;
			//	$this->dbError = "Error Select DB ". $this->dbDB;
      //  $this->dbErrMsg();
			//} else {
				//odbc_query("SET CHARACTER SET ".$this->dbCharacter);
        //odbc_set_charset($this->dbCharacter,$this->link);
			//}
		}
    //echo $this->dbHost, $this->dbUser, $this->dbPassword, $this->dbDB; 
        //echo         $this->dbCharacter;
        //echo odbc_character_set_name($this->link);

		return $this->link;
	}
	
	function dbClose() {
		if (!$this->link) return false;
		@odbc_close($this->link);
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
		if (($this->result = odbc_query($this->sql,$this->link))) {
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
		if (($this->result = odbc_exec($this->link,$this->sql))) {
			$this->numRows=odbc_num_rows($this->result);
			if ($this->dbDebug) {
				$this->dbError = "Query Rows : $this->numRows\n$this->sql";
				$this->dbErrMsg();
			}
			if ($this->numRows>0) {
				$this->dbRead(0);
				odbc_data_seek($this->result, 0);
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
		//if ($this->numRows<=0 || $recno>=$this->numRows) 	return null;
		if ($recno>=0)	odbc_data_seek($this->result, $recno);
		$this->dataRow = odbc_fetch_array($this->result);
		return $this->dataRow;
	}
	
	function dbNumFields() {
		return (odbc_num_fields($this->result));
	}
	
	function dbFetchField( $seq) {
		return (odbc_fetch_field($this->result, $seq));
	}
	
	function dbFieldNames() {
		for ($i=0; $i<odbc_num_fields($this->result); $i++) {
			//$fld = $this->dbFetchField($i);
			$this->fieldNames[$i] = odbc_field_name($this->result, $i+1) ;
			$this->fieldTypes[$i] = odbc_field_type($this->result, $i+1) ;
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
			odbc_free_result($this->result);
		} // End if ($table_name)
		return $showComboBox;
	} // End function Combo_Box
}
?>