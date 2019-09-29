DROP SCHEMA IF EXISTS `inventory`;
CREATE SCHEMA `inventory` DEFAULT CHARACTER SET utf8 ;
USE `inventory` ;

-- -----------------------------------------------------
-- Table `inventory`.`brand`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`brand` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`clotth`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`clotth` (
  `id` INT(64) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`, `name`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`customer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`customer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `contactNo1` VARCHAR(45) NOT NULL DEFAULT '-',
  `contactNo2` VARCHAR(45) NOT NULL DEFAULT '-',
  `address` VARCHAR(45) NOT NULL DEFAULT '-',
  `email` VARCHAR(45) NOT NULL DEFAULT '-',
  `dob` DATE NOT NULL DEFAULT '2012-12-12',
  `points` DOUBLE NOT NULL DEFAULT '0',
  `registered_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`discount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`discount` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL DEFAULT '-',
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `discount_percentage` DOUBLE NOT NULL DEFAULT '0',
  `from_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `to_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`payment_type_grn`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`payment_type_grn` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`supplier`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`supplier` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `contactNo1` VARCHAR(45) NOT NULL DEFAULT '-',
  `contactNo2` VARCHAR(45) NOT NULL DEFAULT '-',
  `address` VARCHAR(100) NOT NULL DEFAULT '-',
  `rating` DOUBLE NOT NULL DEFAULT '0',
  `email` VARCHAR(45) NOT NULL DEFAULT '-',
  `registered_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`grn`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`grn` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `ref_no` VARCHAR(45) NOT NULL DEFAULT '-',
  `invoice_issueddate` DATE NOT NULL DEFAULT '0000-00-00',
  `supplier_id` INT(64) UNSIGNED NOT NULL,
  `payment_type_grn_id` INT(64) UNSIGNED NOT NULL,
  `total_qty` INT(11) NOT NULL DEFAULT '0',
  `total` DOUBLE NOT NULL DEFAULT '0',
  `discount` DOUBLE NOT NULL DEFAULT '0',
  `paid_amount` DOUBLE NOT NULL DEFAULT '0',
  `due_amount` DOUBLE NOT NULL DEFAULT '0',
  `issued_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `notes` VARCHAR(255) NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_grn_supplier_idx` (`supplier_id` ASC) VISIBLE,
  INDEX `fk_grn_payment_type_grn1_idx` (`payment_type_grn_id` ASC) VISIBLE,
  CONSTRAINT `fk_grn_payment_type_grn1`
    FOREIGN KEY (`payment_type_grn_id`)
    REFERENCES `inventory`.`payment_type_grn` (`id`),
  CONSTRAINT `fk_grn_supplier`
    FOREIGN KEY (`supplier_id`)
    REFERENCES `inventory`.`supplier` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`size`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`size` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `size_name` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`product` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `brand_id` INT(64) UNSIGNED NOT NULL,
  `size_id` INT(64) UNSIGNED NOT NULL,
  `clotth_id` INT(64) NOT NULL,
  `product_description` VARCHAR(45) NOT NULL DEFAULT '-',
  `gender` VARCHAR(45) NOT NULL DEFAULT '-',
  `notes` VARCHAR(45) NOT NULL DEFAULT '-',
  `registered_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(64) NOT NULL DEFAULT '-1',
  `available_qty` INT(64) NOT NULL DEFAULT '0',
  `barcode` VARCHAR(45) NOT NULL DEFAULT '-',
  `alert_qty` INT(11) NOT NULL DEFAULT '0',
  `status` INT(1) NOT NULL DEFAULT '1',
  `rating` DOUBLE NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_product_brand1_idx` (`brand_id` ASC) VISIBLE,
  INDEX `fk_product_size1_idx` (`size_id` ASC) VISIBLE,
  INDEX `fk_product_clotth1_idx` (`clotth_id` ASC) VISIBLE,
  CONSTRAINT `fk_product_brand1`
    FOREIGN KEY (`brand_id`)
    REFERENCES `inventory`.`brand` (`id`),
  CONSTRAINT `fk_product_clotth1`
    FOREIGN KEY (`clotth_id`)
    REFERENCES `inventory`.`clotth` (`id`),
  CONSTRAINT `fk_product_size1`
    FOREIGN KEY (`size_id`)
    REFERENCES `inventory`.`size` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`stock` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `grn_id` INT(64) UNSIGNED NOT NULL,
  `product_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) NOT NULL DEFAULT '0',
  `available_qty` INT(11) NOT NULL DEFAULT '0',
  `buying_price` DOUBLE NOT NULL DEFAULT '0',
  `selling_price` DOUBLE NOT NULL DEFAULT '0',
  `profit_percentage` DOUBLE NOT NULL DEFAULT '0',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  `return_status` VARCHAR(50) NULL DEFAULT 'false',
  `return_qty` INT(11) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_stock_grn1_idx` (`grn_id` ASC) VISIBLE,
  INDEX `fk_stock_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_stock_grn1`
    FOREIGN KEY (`grn_id`)
    REFERENCES `inventory`.`grn` (`id`),
  CONSTRAINT `fk_stock_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `inventory`.`product` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 10000000
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`gitft`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`gitft` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `voucher_code` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_gitft_stock1_idx` (`stock_id` ASC) VISIBLE,
  CONSTRAINT `fk_gitft_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`grn_payment_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`grn_payment_history` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `paid_amount` DOUBLE NULL DEFAULT '0',
  `paid_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `note` VARCHAR(50) NULL DEFAULT '-',
  `grnid` INT(11) NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`payment_type_invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`payment_type_invoice` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`invoice` (
  `id` INT(64) NOT NULL AUTO_INCREMENT,
  `customer_id` INT(11) NOT NULL,
  `payment_type_invoice_id` INT(64) UNSIGNED NOT NULL DEFAULT '1',
  `qty` INT(11) NOT NULL DEFAULT '0',
  `discount` DOUBLE NOT NULL DEFAULT '0',
  `total` DOUBLE NOT NULL DEFAULT '0',
  `issued_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `return` DOUBLE NOT NULL DEFAULT '0',
  `gift` DOUBLE NOT NULL DEFAULT '0',
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '3',
  `paid_amount` INT(64) UNSIGNED NOT NULL DEFAULT '0',
  `gross_amount` INT(64) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_customer1_idx` (`customer_id` ASC) VISIBLE,
  INDEX `fk_invoice_payment_type_invoice1_idx` (`payment_type_invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_customer1`
    FOREIGN KEY (`customer_id`)
    REFERENCES `inventory`.`customer` (`id`),
  CONSTRAINT `fk_invoice_payment_type_invoice1`
    FOREIGN KEY (`payment_type_invoice_id`)
    REFERENCES `inventory`.`payment_type_invoice` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`invoice_has_gift`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`invoice_has_gift` (
  `invoice_id` INT(11) NOT NULL,
  `gitft_id` INT(64) UNSIGNED NOT NULL,
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_has_gift_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  INDEX `fk_invoice_has_gift_gitft1_idx` (`gitft_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_has_gift_gitft1`
    FOREIGN KEY (`gitft_id`)
    REFERENCES `inventory`.`gitft` (`id`),
  CONSTRAINT `fk_invoice_has_gift_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `inventory`.`invoice` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`sales_return`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`sales_return` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  `issued_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`invoice_has_sales_return`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`invoice_has_sales_return` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sales_return_id` INT(64) UNSIGNED NOT NULL,
  `invoice_id` INT(11) NOT NULL,
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_has_sales_return_sales_return1_idx` (`sales_return_id` ASC) VISIBLE,
  INDEX `fk_invoice_has_sales_return_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_has_sales_return_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `inventory`.`invoice` (`id`),
  CONSTRAINT `fk_invoice_has_sales_return_sales_return1`
    FOREIGN KEY (`sales_return_id`)
    REFERENCES `inventory`.`sales_return` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`invoice_has_stock`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`invoice_has_stock` (
  `id` INT(64) NOT NULL AUTO_INCREMENT,
  `invoice_id` INT(11) NOT NULL,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) NOT NULL DEFAULT '0',
  `price` INT(64) NOT NULL DEFAULT '0',
  `amount` INT(64) NOT NULL DEFAULT '0',
  `product_description` VARCHAR(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_has_stock_stock1_idx` (`stock_id` ASC) VISIBLE,
  INDEX `fk_invoice_has_stock_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_has_stock_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `inventory`.`invoice` (`id`),
  CONSTRAINT `fk_invoice_has_stock_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`invoice_has_stock_insert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`invoice_has_stock_insert` (
  `id` INT(64) NOT NULL AUTO_INCREMENT,
  `invoice_id` INT(11) NOT NULL,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) NOT NULL DEFAULT '0',
  `price` INT(64) NOT NULL DEFAULT '0',
  `amount` INT(64) NOT NULL DEFAULT '0',
  `product_description` VARCHAR(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  INDEX `fk_invoice_has_stock_insert_stock1_idx` (`stock_id` ASC) VISIBLE,
  INDEX `fk_invoice_has_stock_insert_invoice1_idx` (`invoice_id` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_has_stock_insert_invoice1`
    FOREIGN KEY (`invoice_id`)
    REFERENCES `inventory`.`invoice` (`id`),
  CONSTRAINT `fk_invoice_has_stock_insert_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`product_has_discount`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`product_has_discount` (
  `product_id` INT(64) UNSIGNED NOT NULL,
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `discount_id` INT(64) UNSIGNED NOT NULL,
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  `stockid` INT(11) NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_product_has_discount_product1_idx` (`product_id` ASC) VISIBLE,
  INDEX `fk_product_has_discount_discount1_idx` (`discount_id` ASC) VISIBLE,
  CONSTRAINT `fk_product_has_discount_discount1`
    FOREIGN KEY (`discount_id`)
    REFERENCES `inventory`.`discount` (`id`),
  CONSTRAINT `fk_product_has_discount_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `inventory`.`product` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`sales_return_reg`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`sales_return_reg` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sales_return_id` INT(64) UNSIGNED NOT NULL,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) UNSIGNED NOT NULL DEFAULT '0',
  `selling_price` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `amount` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `product_description` VARCHAR(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  INDEX `fk_sales_return_reg_sales_return1_idx` (`sales_return_id` ASC) VISIBLE,
  INDEX `fk_sales_return_reg_stock1_idx` (`stock_id` ASC) VISIBLE,
  CONSTRAINT `fk_sales_return_reg_sales_return1`
    FOREIGN KEY (`sales_return_id`)
    REFERENCES `inventory`.`sales_return` (`id`),
  CONSTRAINT `fk_sales_return_reg_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`sales_return_reg_insert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`sales_return_reg_insert` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sales_return_id` INT(64) UNSIGNED NOT NULL,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) UNSIGNED NOT NULL DEFAULT '0',
  `selling_price` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `amount` INT(10) UNSIGNED NOT NULL DEFAULT '0',
  `product_description` VARCHAR(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  INDEX `fk_sales_return_reg_insert_sales_return1_idx` (`sales_return_id` ASC) VISIBLE,
  INDEX `fk_sales_return_reg_insert_stock1_idx` (`stock_id` ASC) VISIBLE,
  CONSTRAINT `fk_sales_return_reg_insert_sales_return1`
    FOREIGN KEY (`sales_return_id`)
    REFERENCES `inventory`.`sales_return` (`id`),
  CONSTRAINT `fk_sales_return_reg_insert_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`shop_settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`shop_settings` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(50) NOT NULL,
  `value` VARCHAR(50) NOT NULL DEFAULT '-',
  `description` VARCHAR(100) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`status_codes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`status_codes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `value` INT(11) NOT NULL,
  `description` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`stock_return`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`stock_return` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `reason` VARCHAR(255) NOT NULL DEFAULT '-',
  `total_qty` INT(11) NOT NULL DEFAULT '0',
  `issued_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total` DOUBLE NOT NULL DEFAULT '0',
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  `grnid` INT(64) NULL DEFAULT '0',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`stock_return_reg`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`stock_return_reg` (
  `id` INT(64) UNSIGNED NOT NULL AUTO_INCREMENT,
  `stock_id` INT(64) UNSIGNED NOT NULL,
  `qty` INT(11) NOT NULL DEFAULT '0',
  `stock_return_id` INT(64) UNSIGNED NOT NULL,
  `status` INT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_stock_return_reg_stock1_idx` (`stock_id` ASC) VISIBLE,
  INDEX `fk_stock_return_reg_stock_return1_idx` (`stock_return_id` ASC) VISIBLE,
  CONSTRAINT `fk_stock_return_reg_stock1`
    FOREIGN KEY (`stock_id`)
    REFERENCES `inventory`.`stock` (`id`),
  CONSTRAINT `fk_stock_return_reg_stock_return1`
    FOREIGN KEY (`stock_return_id`)
    REFERENCES `inventory`.`stock_return` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`user_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`user_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL DEFAULT '-',
  `status` INT(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `inventory`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `inventory`.`user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL DEFAULT '-',
  `contactNo` VARCHAR(45) NOT NULL DEFAULT '-',
  `username` VARCHAR(45) NOT NULL DEFAULT '-',
  `password` VARCHAR(45) NOT NULL DEFAULT '12345678',
  `user_type_id` INT(11) NOT NULL,
  `registered_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` INT(11) NOT NULL DEFAULT '-1',
  `status` INT(1) NOT NULL DEFAULT '1',
  `email` VARCHAR(50) NOT NULL DEFAULT '-',
  PRIMARY KEY (`id`),
  INDEX `fk_user_user_type1_idx` (`user_type_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_user_type1`
    FOREIGN KEY (`user_type_id`)
    REFERENCES `inventory`.`user_type` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 1
DEFAULT CHARACTER SET = utf8;
