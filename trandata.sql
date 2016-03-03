ALTER TABLE venm0100 ADD email1 varchar(40) , ADD email2 varchar(40)
	, ADD PRIMARY KEY (cust_no)
	, ADD INDEX venm0101  (cust_abbr)
	, MODIFY date_set date
GO

ALTER TABLE cusm0100 ADD email1 varchar(40) , ADD email2 varchar(40)
  , ADD PRIMARY KEY (cust_no)
  , ADD INDEX cusm0101  (cust_abbr)
  , MODIFY date_set date
  , MODIFY lstdate date
GO

ALTER TABLE stkm0100
    ADD PRIMARY KEY (stk_no)
  , ADD INDEX stkm0101  (stk_namc)
  , MODIFY set_date date
GO

ALTER TABLE wktm0100
    ADD PRIMARY KEY (wkt_no)
  , ADD INDEX wktm0101  (wkt_na)
GO


ALTER TABLE swkm0100 	ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX swkm0101  (stk_no,ser_no)
  , ADD INDEX swkm0102  (stk_no,wkt_no)
  , ADD INDEX swkm0103  (cust_no)
  , CHANGE `desc` note varchar(20)
GO

ALTER TABLE bomm0100 	ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX bomm0101  (bom_no,ser_no)
  , ADD INDEX bomm0102  (bom_no,stk_no)
  , ADD INDEX bomm0103  (stk_no)
GO

ALTER TABLE outh0100
    ADD PRIMARY KEY (doc_no)
  , MODIFY `date` date
  , MODIFY `date1` date
  , MODIFY `date2` date
  , MODIFY `car1` date
  , ADD INDEX outh0101  (date,doc_no)
  , ADD INDEX outh0102  (cust_no,yymm)
GO
ALTER TABLE outi0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX outi0101  (doc_no)
  , ADD INDEX outi0102  (stk_no)
  , CHANGE `desc` note varchar(20)
GO

ALTER TABLE isuh0100
    ADD PRIMARY KEY (doc_no)
  , MODIFY `date` date
  , ADD INDEX isuh0101  (date,doc_no)
  , ADD INDEX isuh0102  (cust_no,yymm)
GO
ALTER TABLE isui0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX isui0101  (doc_no)
  , ADD INDEX isui0102  (stk_no)
  , ADD INDEX isui0103  (wrk_no)
GO


-- wrkm0100 單號重複
--DROP TABLE tmpwrkm0100
CREATE TEMPORARY TABLE tmpwrkm0100
  SELECT *  FROM wrkm0100
go
ALTER TABLE tmpwrkm0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
go
--DROP TABLE tmpwrkmautoid
CREATE TEMPORARY TABLE tmpwrkmautoid
  SELECT DISTINCT  MIN(autoid) autoid FROM tmpwrkm0100
    GROUP BY doc_no
    HAVING COUNT(doc_no)>1
go
DELETE FROM tmpwrkm0100
  WHERE autoid IN (
	 SELECT autoid FROM tmpwrkmautoid
	)
go
ALTER TABLE tmpwrkm0100 DROP COLUMN autoid
go
DELETE FROM wrkm0100
go
INSERT INTO wrkm0100
  SELECT * FROM tmpwrkm0100
go
DROP TEMPORARY TABLE tmpwrkm0100
go
DROP TEMPORARY TABLE tmpwrkmautoid
go
ALTER TABLE wrkm0100 ADD PRIMARY KEY (doc_no)
  , MODIFY `date` date
  , ADD INDEX wrkm0101  (date,doc_no)
  , ADD INDEX wrkm0102  (stk_no)
  , ADD INDEX wrkm0103  (cust_no)
  , ADD INDEX wrkm0104  (bom_no)
  , ADD INDEX wrkm0105  (wkt_no)
go
-----------------------------

-- wodh0100 單號重複
--DROP TABLE tmpwodh0100
CREATE TEMPORARY TABLE tmpwodh0100
  SELECT *  FROM wodh0100
  WHERE doc_no<>""
go
ALTER TABLE tmpwodh0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
go
--DROP TABLE tmpwodhautoid
CREATE TEMPORARY TABLE tmpwodhautoid
  SELECT DISTINCT  MIN(autoid) autoid FROM tmpwodh0100
    GROUP BY doc_no
    HAVING COUNT(doc_no)>1
go
DELETE FROM tmpwodh0100
  WHERE autoid IN (
	 SELECT autoid FROM tmpwodhautoid
	)
go
ALTER TABLE tmpwodh0100 DROP COLUMN autoid
go
DELETE FROM wodh0100
go
INSERT INTO wodh0100
  SELECT * FROM tmpwodh0100
go
DROP TEMPORARY TABLE tmpwodh0100
go
DROP TEMPORARY TABLE tmpwodhautoid
go
ALTER TABLE wodh0100
    ADD PRIMARY KEY (doc_no)
  , MODIFY `date` date
  , ADD INDEX wodh0101  (date,doc_no)
  , ADD INDEX wodh0102  (cust_no)
  , ADD INDEX wodh0103  (stk_no)
  , ADD INDEX wodh0104  (bom_no)
GO
ALTER TABLE wodi0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX wodi0101  (doc_no,stk_no)
  , ADD INDEX wodi0102  (stk_no,doc_no)
GO

ALTER TABLE vrcm0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX vrcm0101  (yymm,cust_no)
  , ADD INDEX vrcm0102  (cust_no,yymm)
  , MODIFY `date` date
GO

ALTER TABLE crcm0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX crcm0101  (yymm,cust_no)
  , ADD INDEX crcm0102  (cust_no,yymm)
  , MODIFY `date` date
GO

ALTER TABLE pass
    ADD PRIMARY KEY (name)
   , CHANGE `GROUP` menugroup varchar(10)
   , MODIFY `password` varchar(20)
go

ALTER TABLE empm0100
    ADD PRIMARY KEY (emp_no)
  , ADD INDEX empm0101  (emp_name)
  , ADD INDEX empm0102  (id_no,passport)
  , MODIFY `br_date` date
  , MODIFY `in_date` date
  , MODIFY `fr_date` date
go

ALTER TABLE srym0100 ADD autoid double NOT NULL AUTO_INCREMENT  PRIMARY KEY
  , ADD INDEX srym0101  (yymm,emp_no)
  , ADD INDEX srym0102  (emp_no,yymm)
--  , MODIFY `date` date
go

-- 出貨單 加幣別&滙率
ALTER TABLE outh0100
    ADD usdtwd varchar(4) DEFAULT 'TWD'
  , ADD currate double DEFAULT 1
  , ADD usd_amt double
GO

UPDATE outh0100 SET usd_amt = amt
GO

UPDATE outh0100 SET usdtwd = 'USD'
  , usd_amt = (
    SUBSTRING(remark, POSITION("USD" IN remark)+3
	   , LOCATE( "*" , remark , POSITION("USD" IN remark) ) - POSITION("USD" IN remark)-3)
  )
  , currate = (
    SUBSTRING(remark, LOCATE( "*" , remark , POSITION("USD" IN remark) )+1 )
  )
WHERE remark LIKE '%USD%*%'
GO
