DELIMITER $$
-- // 工令單扣庫存  flag='*'
DROP TRIGGER IF EXISTS `jm`.`wodiBefoeUpdate` $$
CREATE TRIGGER `jm`.`wodiBefoeUpdate`	BEFORE UPDATE ON wodi0100 FOR EACH ROW
BEGIN
  IF (OLD.flag="*") THEN
    UPDATE stkm0100 SET qty = qty + OLD.qty  WHERE stk_no = OLD.stk_no ;
  END IF ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`wodiAfterUpdate` $$
CREATE TRIGGER `jm`.`wodiAfterUpdate`	AFTER UPDATE ON wodi0100 FOR EACH ROW
BEGIN
  IF (NEW.flag="*") THEN
    UPDATE stkm0100 SET qty = qty - NEW.qty  WHERE stk_no = NEW.stk_no ;
  END IF ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`wodiBefoeDelete` $$
CREATE TRIGGER `jm`.`wodiBefoeDelete`	BEFORE DELETE ON wodi0100 FOR EACH ROW
BEGIN
  IF (OLD.flag="*") THEN
    UPDATE stkm0100 SET qty = qty + OLD.qty  WHERE stk_no = OLD.stk_no ;
  END IF ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`wodiAfterInsert` $$
CREATE TRIGGER `jm`.`wodiAfterInsert`	AFTER INSERT ON wodi0100 FOR EACH ROW
BEGIN
  IF (NEW.flag="*") THEN
    UPDATE stkm0100 SET qty = qty - NEW.qty  WHERE stk_no = NEW.stk_no ;
  END IF ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`wodhBefoeDelete` $$
CREATE TRIGGER `jm`.`wodhBefoeDelete`	BEFORE DELETE ON wodh0100 FOR EACH ROW
BEGIN
	DELETE FROM wodi0100 WHERE wodi0100.doc_no = OLD.doc_no ;
END ;  $$

-- // 入庫  in_stk='Y'
DROP TRIGGER IF EXISTS `jm`.`isuiBefoeUpdate` $$
CREATE TRIGGER `jm`.`isuiBefoeUpdate`	BEFORE UPDATE ON isui0100 FOR EACH ROW
BEGIN
  IF (OLD.in_stk="Y") THEN
    UPDATE stkm0100 SET qty = qty - OLD.qty  WHERE stk_no = OLD.stk_no ;
  END IF ;
    UPDATE wrkm0100 SET ins_qty = ins_qty - OLD.qty  WHERE doc_no = OLD.wrk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`isuiAfterUpdate` $$
CREATE TRIGGER `jm`.`isuiAfterUpdate`	AFTER UPDATE ON isui0100 FOR EACH ROW
BEGIN
  IF (NEW.in_stk="Y") THEN
    UPDATE stkm0100 SET qty = qty + NEW.qty  WHERE stk_no = NEW.stk_no ;
  END IF ;
    UPDATE wrkm0100 SET ins_qty = ins_qty + NEW.qty  WHERE doc_no = NEW.wrk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`isuiBefoeDelete` $$
CREATE TRIGGER `jm`.`isuiBefoeDelete`	BEFORE DELETE ON isui0100 FOR EACH ROW
BEGIN
  IF (OLD.in_stk="Y") THEN
    UPDATE stkm0100 SET qty = qty - OLD.qty  WHERE stk_no = OLD.stk_no ;
  END IF ;
    UPDATE wrkm0100 SET ins_qty = ins_qty - OLD.qty  WHERE doc_no = OLD.wrk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`isuiAfterInsert` $$
CREATE TRIGGER `jm`.`isuiAfterInsert`	AFTER INSERT ON isui0100 FOR EACH ROW
BEGIN
  IF (NEW.in_stk="Y") THEN
    UPDATE stkm0100 SET qty = qty + NEW.qty  WHERE stk_no = NEW.stk_no ;
  END IF ;
    UPDATE wrkm0100 SET ins_qty = ins_qty + NEW.qty  WHERE doc_no = NEW.wrk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`isuhBefoeDelete` $$
CREATE TRIGGER `jm`.`isuhBefoeDelete`	BEFORE DELETE ON isuh0100 FOR EACH ROW
BEGIN
	DELETE FROM isui0100 WHERE isui0100.doc_no = OLD.doc_no ;
END ;  $$

-- // 出貨
DROP TRIGGER IF EXISTS `jm`.`outiBefoeUpdate` $$
CREATE TRIGGER `jm`.`outiBefoeUpdate`	BEFORE UPDATE ON outi0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.qty = stkm0100.qty + OLD.qty WHERE stkm0100.stk_no = OLD.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`outiAfterUpdate` $$
CREATE TRIGGER `jm`.`outiAfterUpdate`	AFTER UPDATE ON outi0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.qty = stkm0100.qty - NEW.qty	WHERE stkm0100.stk_no = NEW.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`outiBefoeDelete` $$
CREATE TRIGGER `jm`.`outiBefoeDelete`	BEFORE DELETE ON outi0100 FOR EACH ROW
BEGIN
	 UPDATE stkm0100 SET stkm0100.qty = stkm0100.qty + OLD.qty WHERE stkm0100.stk_no = OLD.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`outiAfterInsert` $$
CREATE TRIGGER `jm`.`outiAfterInsert`	AFTER INSERT ON outi0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.qty = stkm0100.qty - NEW.qty	WHERE stkm0100.stk_no = NEW.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`outhBefoeDelete` $$
CREATE TRIGGER `jm`.`outhBefoeDelete`	BEFORE DELETE ON outh0100 FOR EACH ROW
BEGIN
	DELETE FROM outi0100 WHERE outi0100.doc_no = OLD.doc_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`outhAfterInsert` $$
CREATE TRIGGER `jm`.`outhAfterInsert`	AFTER INSERT ON outh0100 FOR EACH ROW
BEGIN
    UPDATE cusm0100 SET cusm0100.lstdate = NEW.date  , cusm0100.c_buy='A'  ;
END ;  $$

-- // 加工成本
DROP TRIGGER IF EXISTS `jm`.`swkmAfterInsert` $$
CREATE TRIGGER `jm`.`swkmAfterInsert`	AFTER INSERT ON swkm0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.wkcost =
      ( SELECT SUM(swkm0100.price) FROM swkm0100 WHERE swkm0100.stk_no = NEW.stk_no AND (ser_no IS NULL OR ser_no NOT LIKE '%*%') )
    WHERE stkm0100.stk_no = NEW.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`swkmAfterUpdate` $$
CREATE TRIGGER `jm`.`swkmAfterUpdate`	AFTER UPDATE ON swkm0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.wkcost =
      ( SELECT SUM(swkm0100.price) FROM swkm0100 WHERE swkm0100.stk_no = NEW.stk_no AND (ser_no IS NULL OR ser_no NOT LIKE '%*%') )
    WHERE stkm0100.stk_no = NEW.stk_no ;
END ;  $$

DROP TRIGGER IF EXISTS `jm`.`swkmAfterDelete` $$
CREATE TRIGGER `jm`.`swkmAfterDelete`	AFTER DELETE ON swkm0100 FOR EACH ROW
BEGIN
  	UPDATE stkm0100 SET stkm0100.wkcost =
      ( SELECT SUM(swkm0100.price) FROM swkm0100 WHERE swkm0100.stk_no = OLD.stk_no AND (ser_no IS NULL OR ser_no NOT LIKE '%*%') )
    WHERE stkm0100.stk_no = OLD.stk_no ;
END ;  $$


DELIMITER ;
