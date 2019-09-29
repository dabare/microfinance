
USE `inventory` ;

CREATE VIEW `inventory`.`ViewStockReturns` AS select 'STRE' AS `STRE`,`inventory`.`stock_return`.`id` AS `id`,`inventory`.`stock_return`.`reason` AS `reason`,`inventory`.`stock_return`.`total_qty` AS `total_qty`,`inventory`.`stock_return`.`issued_time` AS `issued_time`,`inventory`.`stock_return`.`total` AS `total`,`inventory`.`stock_return`.`status` AS `status`,`inventory`.`stock_return`.`grnid` AS `grnid` from `inventory`.`stock_return` where (`inventory`.`stock_return`.`status` = 1) order by `inventory`.`stock_return`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`getCusPoints`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getCusPoints` AS select `inventory`.`shop_settings`.`id` AS `id`,`inventory`.`shop_settings`.`key` AS `key`,`inventory`.`shop_settings`.`value` AS `value`,`inventory`.`shop_settings`.`description` AS `description` from `inventory`.`shop_settings` where (`inventory`.`shop_settings`.`key` = 'cus_points');

-- -----------------------------------------------------
-- View `inventory`.`getDailyReturnTotal`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDailyReturnTotal` AS select sum(`inventory`.`sales_return`.`total`) AS `totalReturn`,count(`inventory`.`sales_return`.`id`) AS `returnCount` from `inventory`.`sales_return` where (((dayofmonth(`inventory`.`sales_return`.`issued_date`) = dayofmonth(curdate())) & `inventory`.`sales_return`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getDepartmentReturnDaily`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepartmentReturnDaily` AS select count(`p`.`gender`) AS `y`,`p`.`gender` AS `name`,(sum(`srr`.`amount`) * -(1)) AS `total` from (((`inventory`.`sales_return` `sl` join `inventory`.`sales_return_reg` `srr` on((`sl`.`id` = `srr`.`sales_return_id`))) join `inventory`.`stock` `s` on((`s`.`id` = `srr`.`stock_id`))) join `inventory`.`product` `p` on((`p`.`id` = `s`.`product_id`))) where (((dayofmonth(`sl`.`issued_date`) = dayofmonth(curdate())) & `sl`.`status`) = '1') group by `p`.`gender`;

-- -----------------------------------------------------
-- View `inventory`.`getDepartmentSalesDaily`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepartmentSalesDaily` AS select count(`p`.`gender`) AS `y`,`p`.`gender` AS `name`,sum(`ihs`.`amount`) AS `total` from (((`inventory`.`invoice` `i` join `inventory`.`invoice_has_stock` `ihs` on((`i`.`id` = `ihs`.`invoice_id`))) join `inventory`.`stock` `s` on((`ihs`.`stock_id` = `s`.`id`))) join `inventory`.`product` `p` on((`p`.`id` = `s`.`product_id`))) where (((dayofmonth(`i`.`issued_date`) = dayofmonth(curdate())) & `i`.`status`) = '1') group by `p`.`gender`;

-- -----------------------------------------------------
-- View `inventory`.`getDepartmentSalesNReturn`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepartmentSalesNReturn` AS select count(`t`.`name`) AS `y`,`t`.`name` AS `name`,sum(`t`.`total`) AS `total` from (select `getDepartmentSalesDaily`.`y` AS `y`,`getDepartmentSalesDaily`.`name` AS `name`,`getDepartmentSalesDaily`.`total` AS `total` from `inventory`.`getDepartmentSalesDaily` union select `getDepartmentReturnDaily`.`y` AS `y`,`getDepartmentReturnDaily`.`name` AS `name`,`getDepartmentReturnDaily`.`total` AS `total` from `inventory`.`getDepartmentReturnDaily`) `t` group by `t`.`name`;

-- -----------------------------------------------------
-- View `inventory`.`getDepartmentSalesNReturnMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepartmentSalesNReturnMonthly` AS select count(`t`.`name`) AS `y`,`t`.`name` AS `name`,sum(`t`.`total`) AS `total` from (select `getDepatmentSalesMonthly`.`y` AS `y`,`getDepatmentSalesMonthly`.`name` AS `name`,`getDepatmentSalesMonthly`.`total` AS `total` from `inventory`.`getDepatmentSalesMonthly` union select `getDepartmetReturnMonthly`.`y` AS `y`,`getDepartmetReturnMonthly`.`name` AS `name`,`getDepartmetReturnMonthly`.`total` AS `total` from `inventory`.`getDepartmetReturnMonthly`) `t` group by `t`.`name`;

-- -----------------------------------------------------
-- View `inventory`.`getDepartmetReturnMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepartmetReturnMonthly` AS select count(`p`.`gender`) AS `y`,`p`.`gender` AS `name`,(sum(`srr`.`amount`) * -(1)) AS `total` from (((`inventory`.`sales_return` `sl` join `inventory`.`sales_return_reg` `srr` on((`sl`.`id` = `srr`.`sales_return_id`))) join `inventory`.`stock` `s` on((`s`.`id` = `srr`.`stock_id`))) join `inventory`.`product` `p` on((`p`.`id` = `s`.`product_id`))) where (((month(`sl`.`issued_date`) = month(curdate())) & `sl`.`status`) = '1') group by `p`.`gender`;

-- -----------------------------------------------------
-- View `inventory`.`getDepatmentSalesMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDepatmentSalesMonthly` AS select count(`p`.`gender`) AS `y`,`p`.`gender` AS `name`,sum(`ihs`.`amount`) AS `total` from (((`inventory`.`invoice` `i` join `inventory`.`invoice_has_stock` `ihs` on((`i`.`id` = `ihs`.`invoice_id`))) join `inventory`.`stock` `s` on((`ihs`.`stock_id` = `s`.`id`))) join `inventory`.`product` `p` on((`p`.`id` = `s`.`product_id`))) where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1') group by `p`.`gender`;

-- -----------------------------------------------------
-- View `inventory`.`getDiscountedProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getDiscountedProducts` AS select `inventory`.`discount`.`id` AS `did`,`inventory`.`product_has_discount`.`stockid` AS `stockid`,`inventory`.`product_has_discount`.`stockid` AS `sid`,`inventory`.`discount`.`id` AS `discountid`,`inventory`.`product`.`product_description` AS `product_description`,`inventory`.`product`.`id` AS `pid`,`inventory`.`product`.`id` AS `product_id`,`inventory`.`stock`.`buying_price` AS `buying_price`,`inventory`.`stock`.`selling_price` AS `selling_price`,(`inventory`.`stock`.`selling_price` - (`inventory`.`stock`.`selling_price` * (`inventory`.`discount`.`discount_percentage` / 100))) AS `discounted_price`,`inventory`.`stock`.`available_qty` AS `available_qty` from (((`inventory`.`discount` join `inventory`.`product_has_discount` on((`inventory`.`discount`.`id` = `inventory`.`product_has_discount`.`discount_id`))) join `inventory`.`product` on((`inventory`.`product`.`id` = `inventory`.`product_has_discount`.`product_id`))) join `inventory`.`stock` on((`inventory`.`stock`.`id` = `inventory`.`product_has_discount`.`stockid`)));

-- -----------------------------------------------------
-- View `inventory`.`getHomeIncomeDaily`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomeIncomeDaily` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalInvoice`,sum(`i`.`discount`) AS `discount` from `inventory`.`invoice` `i` where (((dayofmonth(`i`.`issued_date`) = dayofmonth(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getHomeIncomeMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomeIncomeMonthly` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalInvoice`,sum(`i`.`discount`) AS `discount` from `inventory`.`invoice` `i` where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getHomeOutcomeDaily`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomeOutcomeDaily` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalGRN` from `inventory`.`grn` `i` where (((dayofmonth(`i`.`issued_time`) = dayofmonth(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getHomeOutcomeMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomeOutcomeMonthly` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalGRN` from `inventory`.`grn` `i` where (((month(`i`.`issued_time`) = month(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getHomeReturnDaily`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomeReturnDaily` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalGRN` from `inventory`.`sales_return` `i` where (((dayofmonth(`i`.`issued_date`) = dayofmonth(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getHomerReturnMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getHomerReturnMonthly` AS select sum(`i`.`total`) AS `total`,count(`i`.`total`) AS `totalGRN` from `inventory`.`sales_return` `i` where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getInvoiceProductCount`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getInvoiceProductCount` AS select count(`inventory`.`invoice_has_stock`.`id`) AS `count`,`inventory`.`invoice_has_stock`.`id` AS `id` from `inventory`.`invoice_has_stock` group by `inventory`.`invoice_has_stock`.`invoice_id`;

-- -----------------------------------------------------
-- View `inventory`.`getMaxBrandId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMaxBrandId` AS select max(`inventory`.`brand`.`id`) AS `bid` from `inventory`.`brand`;

-- -----------------------------------------------------
-- View `inventory`.`getMaxClothId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMaxClothId` AS select max(`inventory`.`clotth`.`id`) AS `cid` from `inventory`.`clotth`;

-- -----------------------------------------------------
-- View `inventory`.`getMaxProductId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMaxProductId` AS select max(`inventory`.`product`.`id`) AS `pid` from `inventory`.`product`;

-- -----------------------------------------------------
-- View `inventory`.`getMaxSizeId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMaxSizeId` AS select max(`inventory`.`size`.`id`) AS `sid` from `inventory`.`size`;

-- -----------------------------------------------------
-- View `inventory`.`getMaxSupplierId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMaxSupplierId` AS select max(`inventory`.`supplier`.`id`) AS `sid` from `inventory`.`supplier`;

-- -----------------------------------------------------
-- View `inventory`.`getMonthlyIncomeData`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMonthlyIncomeData` AS select sum(`i`.`total`) AS `y`,cast(`i`.`issued_date` as date) AS `label` from `inventory`.`invoice` `i` where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1') group by dayofmonth(`i`.`issued_date`);

-- -----------------------------------------------------
-- View `inventory`.`getMonthlyReturnData`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMonthlyReturnData` AS select (sum(`i`.`total`) * -(1)) AS `y`,cast(`i`.`issued_date` as date) AS `label` from `inventory`.`sales_return` `i` where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1') group by dayofmonth(`i`.`issued_date`);

-- -----------------------------------------------------
-- View `inventory`.`getMonthlyReturnTotal`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMonthlyReturnTotal` AS select sum(`inventory`.`sales_return`.`total`) AS `totalReturn`,count(`inventory`.`sales_return`.`id`) AS `returnCount` from `inventory`.`sales_return` where (((month(`inventory`.`sales_return`.`issued_date`) = month(curdate())) & `inventory`.`sales_return`.`status`) = '1');

-- -----------------------------------------------------
-- View `inventory`.`getMonthlyTotalIncome`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getMonthlyTotalIncome` AS select sum(`t`.`y`) AS `y`,`t`.`label` AS `label` from (select `getMonthlyIncomeData`.`y` AS `y`,`getMonthlyIncomeData`.`label` AS `label` from `inventory`.`getMonthlyIncomeData` union select `getMonthlyReturnData`.`y` AS `y`,`getMonthlyReturnData`.`label` AS `label` from `inventory`.`getMonthlyReturnData`) `t` group by `t`.`label`;

-- -----------------------------------------------------
-- View `inventory`.`getNewCustomerId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewCustomerId` AS select max(`inventory`.`customer`.`id`) AS `id` from `inventory`.`customer`;

-- -----------------------------------------------------
-- View `inventory`.`getNewDiscount`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewDiscount` AS select max(`inventory`.`discount`.`id`) AS `id` from `inventory`.`discount`;

-- -----------------------------------------------------
-- View `inventory`.`getNewGRNId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewGRNId` AS select max(`inventory`.`grn`.`id`) AS `id` from `inventory`.`grn`;

-- -----------------------------------------------------
-- View `inventory`.`getNewInvoiceId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewInvoiceId` AS select max(`inventory`.`invoice`.`id`) AS `id` from `inventory`.`invoice`;

-- -----------------------------------------------------
-- View `inventory`.`getNewInvoiceProductId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewInvoiceProductId` AS select max(`inventory`.`invoice_has_stock`.`id`) AS `id` from `inventory`.`invoice_has_stock`;

-- -----------------------------------------------------
-- View `inventory`.`getNewReturnId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewReturnId` AS select max(`inventory`.`sales_return`.`id`) AS `id` from `inventory`.`sales_return`;

-- -----------------------------------------------------
-- View `inventory`.`getNewStockReturnId`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getNewStockReturnId` AS select max(`inventory`.`stock_return`.`id`) AS `id` from `inventory`.`stock_return`;

-- -----------------------------------------------------
-- View `inventory`.`getPaymentTypeSales`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getPaymentTypeSales` AS select sum(`i`.`total`) AS `total`,`pti`.`type` AS `type` from (`inventory`.`invoice` `i` join `inventory`.`payment_type_invoice` `pti` on((`i`.`payment_type_invoice_id` = `pti`.`id`))) where (((dayofmonth(`i`.`issued_date`) = dayofmonth(curdate())) & `i`.`status`) = '1') group by `pti`.`id`;

-- -----------------------------------------------------
-- View `inventory`.`getPaymentTypeSalesMonthly`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getPaymentTypeSalesMonthly` AS select sum(`i`.`total`) AS `total`,`pti`.`type` AS `type` from (`inventory`.`invoice` `i` join `inventory`.`payment_type_invoice` `pti` on((`i`.`payment_type_invoice_id` = `pti`.`id`))) where (((month(`i`.`issued_date`) = month(curdate())) & `i`.`status`) = '1') group by `pti`.`id`;

-- -----------------------------------------------------
-- View `inventory`.`getProdPoints`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getProdPoints` AS select `inventory`.`shop_settings`.`id` AS `id`,`inventory`.`shop_settings`.`key` AS `key`,`inventory`.`shop_settings`.`value` AS `value`,`inventory`.`shop_settings`.`description` AS `description` from `inventory`.`shop_settings` where (`inventory`.`shop_settings`.`key` = 'prod_points');

-- -----------------------------------------------------
-- View `inventory`.`getProductSupplier`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getProductSupplier` AS select `inventory`.`stock`.`id` AS `stockid`,`g`.`id` AS `grnid`,`s`.`id` AS `sid`,`s`.`rating` AS `rating` from ((`inventory`.`stock` join `inventory`.`grn` `g` on((`inventory`.`stock`.`grn_id` = `g`.`id`))) left join `inventory`.`supplier` `s` on((`s`.`id` = `g`.`supplier_id`)));

-- -----------------------------------------------------
-- View `inventory`.`getStockProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getStockProducts` AS select `p`.`id` AS `pid`,`s`.`id` AS `sid`,`p`.`product_description` AS `product_description`,`s`.`buying_price` AS `buying_price`,`s`.`selling_price` AS `selling_price`,`s`.`available_qty` AS `available_qty` from (`inventory`.`product` `p` join `inventory`.`stock` `s` on((`p`.`id` = `s`.`product_id`)));

-- -----------------------------------------------------
-- View `inventory`.`getStockReport`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getStockReport` AS select `p`.`id` AS `pid`,`p`.`product_description` AS `product_description`,`p`.`gender` AS `gender`,`s`.`id` AS `sid`,`s`.`qty` AS `qty`,`s`.`available_qty` AS `available_qty`,`p`.`alert_qty` AS `alert_qty`,`s`.`grn_id` AS `grn_id`,`sup`.`name` AS `name` from (((`inventory`.`stock` `s` join `inventory`.`product` `p` on((`s`.`product_id` = `p`.`id`))) join `inventory`.`grn` `g` on((`g`.`id` = `s`.`grn_id`))) join `inventory`.`supplier` `sup` on((`g`.`supplier_id` = `sup`.`id`))) where ((`s`.`status` = ('1' & `p`.`status`)) = '1') order by `p`.`product_description`;

-- -----------------------------------------------------
-- View `inventory`.`getSupPoints`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getSupPoints` AS select `inventory`.`shop_settings`.`id` AS `id`,`inventory`.`shop_settings`.`key` AS `key`,`inventory`.`shop_settings`.`value` AS `value`,`inventory`.`shop_settings`.`description` AS `description` from `inventory`.`shop_settings` where (`inventory`.`shop_settings`.`key` = 'sup_points');

-- -----------------------------------------------------
-- View `inventory`.`getTopSellingProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getTopSellingProducts` AS select `inventory`.`product`.`id` AS `id`,`inventory`.`product`.`brand_id` AS `brand_id`,`b`.`name` AS `brand_name`,`inventory`.`product`.`size_id` AS `size_id`,`inventory`.`product`.`clotth_id` AS `clotth_id`,`inventory`.`product`.`product_description` AS `product_description`,`inventory`.`product`.`gender` AS `gender`,`inventory`.`product`.`notes` AS `notes`,`inventory`.`product`.`registered_date` AS `registered_date`,`inventory`.`product`.`userid` AS `userid`,`inventory`.`product`.`available_qty` AS `available_qty`,`inventory`.`product`.`barcode` AS `barcode`,`inventory`.`product`.`alert_qty` AS `alert_qty`,`inventory`.`product`.`status` AS `status`,`inventory`.`product`.`rating` AS `rating` from (`inventory`.`product` join `inventory`.`brand` `b` on((`b`.`id` = `inventory`.`product`.`brand_id`))) order by `inventory`.`product`.`rating` desc limit 5;

-- -----------------------------------------------------
-- View `inventory`.`getTopSuppliers`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getTopSuppliers` AS select `inventory`.`supplier`.`id` AS `id`,`inventory`.`supplier`.`name` AS `name`,`inventory`.`supplier`.`contactNo1` AS `contactNo1`,`inventory`.`supplier`.`contactNo2` AS `contactNo2`,`inventory`.`supplier`.`address` AS `address`,`inventory`.`supplier`.`rating` AS `rating`,`inventory`.`supplier`.`email` AS `email`,`inventory`.`supplier`.`registered_date` AS `registered_date`,`inventory`.`supplier`.`userid` AS `userid`,`inventory`.`supplier`.`status` AS `status` from `inventory`.`supplier` order by `inventory`.`supplier`.`rating` desc limit 5;

-- -----------------------------------------------------
-- View `inventory`.`getTotalProductRating`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getTotalProductRating` AS select sum(`s`.`rating`) AS `totalRating` from `inventory`.`product` `s`;

-- -----------------------------------------------------
-- View `inventory`.`getTotalSupplierRating`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`getTotalSupplierRating` AS select sum(`s`.`rating`) AS `totalRating` from `inventory`.`supplier` `s`;

-- -----------------------------------------------------
-- View `inventory`.`gettopSellingBrands`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`gettopSellingBrands` AS select `inventory`.`product`.`id` AS `id`,`inventory`.`product`.`brand_id` AS `brand_id`,`b`.`name` AS `brand_name`,`inventory`.`product`.`size_id` AS `size_id`,`inventory`.`product`.`clotth_id` AS `clotth_id`,`inventory`.`product`.`product_description` AS `product_description`,`inventory`.`product`.`gender` AS `gender`,`inventory`.`product`.`notes` AS `notes`,`inventory`.`product`.`registered_date` AS `registered_date`,`inventory`.`product`.`userid` AS `userid`,`inventory`.`product`.`available_qty` AS `available_qty`,`inventory`.`product`.`barcode` AS `barcode`,`inventory`.`product`.`alert_qty` AS `alert_qty`,`inventory`.`product`.`status` AS `status`,`inventory`.`product`.`rating` AS `rating` from (`inventory`.`product` join `inventory`.`brand` `b` on((`b`.`id` = `inventory`.`product`.`brand_id`))) group by `inventory`.`product`.`brand_id` order by `inventory`.`product`.`rating` desc limit 5;

-- -----------------------------------------------------
-- View `inventory`.`viewAllActiveUsers`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllActiveUsers` AS select `inventory`.`user`.`id` AS `id`,`inventory`.`user`.`name` AS `name`,`inventory`.`user`.`contactNo` AS `contactNo`,`inventory`.`user`.`username` AS `username`,`inventory`.`user`.`password` AS `password`,`inventory`.`user`.`user_type_id` AS `user_type_id`,`inventory`.`user`.`registered_date` AS `registered_date`,`inventory`.`user`.`userid` AS `userid`,`inventory`.`user`.`status` AS `status`,`inventory`.`user`.`email` AS `email`,`inventory`.`user_type`.`type` AS `type`,`cu`.`name` AS `created_by` from ((`inventory`.`user` left join `inventory`.`user_type` on((`inventory`.`user`.`user_type_id` = `inventory`.`user_type`.`id`))) left join `inventory`.`user` `cu` on((`inventory`.`user`.`userid` = `cu`.`id`))) where (`inventory`.`user`.`status` = 1);

-- -----------------------------------------------------
-- View `inventory`.`viewAllBrands`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllBrands` AS select `inventory`.`brand`.`id` AS `id`,`inventory`.`brand`.`name` AS `brand_name` from `inventory`.`brand` order by `inventory`.`brand`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllCloths`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllCloths` AS select `inventory`.`clotth`.`id` AS `id`,`inventory`.`clotth`.`name` AS `cloth_name` from `inventory`.`clotth` order by `inventory`.`clotth`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllCustomers`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllCustomers` AS select `inventory`.`customer`.`id` AS `id`,`inventory`.`customer`.`name` AS `name`,`inventory`.`customer`.`contactNo1` AS `contactNo1`,`inventory`.`customer`.`contactNo2` AS `contactNo2`,`inventory`.`customer`.`address` AS `address`,`inventory`.`customer`.`email` AS `email`,date_format(`inventory`.`customer`.`dob`,'%m-%d-%Y') AS `dob`,`inventory`.`customer`.`points` AS `points`,`inventory`.`customer`.`userid` AS `userid`,date_format(`inventory`.`customer`.`registered_date`,'%m-%d-%Y') AS `registered_date` from `inventory`.`customer` where (`inventory`.`customer`.`status` = 1) order by `inventory`.`customer`.`name`;

-- -----------------------------------------------------
-- View `inventory`.`viewAllDiscounts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllDiscounts` AS select `inventory`.`discount`.`id` AS `id`,`inventory`.`discount`.`type` AS `type`,`inventory`.`discount`.`name` AS `name`,`inventory`.`discount`.`discount_percentage` AS `discount_percentage`,cast(`inventory`.`discount`.`from_date` as date) AS `from_date`,cast(`inventory`.`discount`.`to_date` as date) AS `to_date`,`inventory`.`discount`.`added_date` AS `added_date`,`inventory`.`discount`.`userid` AS `userid`,`inventory`.`discount`.`status` AS `status` from `inventory`.`discount` where (`inventory`.`discount`.`status` = 1);

-- -----------------------------------------------------
-- View `inventory`.`viewAllGRN`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllGRN` AS select `g`.`issued_time` AS `issued_time`,`g`.`id` AS `id`,`g`.`ref_no` AS `ref_no`,`g`.`invoice_issueddate` AS `invoice_issueddate`,`g`.`notes` AS `notes`,`s`.`name` AS `name`,`g`.`total` AS `total`,`g`.`discount` AS `discount`,`g`.`paid_amount` AS `paid_amount`,`g`.`due_amount` AS `due_amount`,`g`.`status` AS `status` from (`inventory`.`grn` `g` join `inventory`.`supplier` `s` on((`g`.`supplier_id` = `s`.`id`))) order by `g`.`issued_time` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllInvoices`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllInvoices` AS select `inventory`.`invoice`.`id` AS `id`,`inventory`.`invoice`.`customer_id` AS `customer_id`,`inventory`.`invoice`.`payment_type_invoice_id` AS `payment_type_invoice_id`,`inventory`.`invoice`.`qty` AS `qty`,`inventory`.`invoice`.`discount` AS `discount`,`inventory`.`invoice`.`total` AS `total`,`inventory`.`invoice`.`issued_date` AS `issued_date`,`inventory`.`invoice`.`return` AS `return`,`inventory`.`invoice`.`gift` AS `gift`,`inventory`.`invoice`.`userid` AS `userid`,`inventory`.`invoice`.`status` AS `status`,`inventory`.`invoice`.`paid_amount` AS `paid_amount`,`inventory`.`invoice`.`gross_amount` AS `gross_amount`,`inventory`.`customer`.`name` AS `customer`,`inventory`.`payment_type_invoice`.`type` AS `payment_type` from ((`inventory`.`invoice` left join `inventory`.`customer` on((`inventory`.`invoice`.`customer_id` = `inventory`.`customer`.`id`))) left join `inventory`.`payment_type_invoice` on((`inventory`.`invoice`.`payment_type_invoice_id` = `inventory`.`payment_type_invoice`.`id`))) where (`inventory`.`invoice`.`status` <> '0') order by `inventory`.`invoice`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllPaymentTypeGrn`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllPaymentTypeGrn` AS select `inventory`.`payment_type_grn`.`id` AS `id`,`inventory`.`payment_type_grn`.`type` AS `type`,`inventory`.`payment_type_grn`.`status` AS `status` from `inventory`.`payment_type_grn` where (`inventory`.`payment_type_grn`.`status` = 1);

-- -----------------------------------------------------
-- View `inventory`.`viewAllPaymentTypesInvoice`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllPaymentTypesInvoice` AS select `inventory`.`payment_type_invoice`.`id` AS `id`,`inventory`.`payment_type_invoice`.`type` AS `type`,`inventory`.`payment_type_invoice`.`status` AS `status` from `inventory`.`payment_type_invoice` where (`inventory`.`payment_type_invoice`.`status` = 1);

-- -----------------------------------------------------
-- View `inventory`.`viewAllProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllProducts` AS select `p`.`id` AS `id`,`b`.`name` AS `brand`,`b`.`id` AS `brand_id`,`s`.`size_name` AS `size`,`s`.`id` AS `size_id`,`c`.`name` AS `cloth`,`c`.`id` AS `cloth_id`,`p`.`product_description` AS `product_description`,`p`.`gender` AS `gender`,`p`.`notes` AS `notes`,`p`.`registered_date` AS `registered_date`,`p`.`userid` AS `userid`,`p`.`available_qty` AS `available_qty`,`p`.`alert_qty` AS `alert_qty`,`p`.`status` AS `status`,`p`.`rating` AS `rating` from (((`inventory`.`product` `p` join `inventory`.`brand` `b` on((`p`.`brand_id` = `b`.`id`))) join `inventory`.`clotth` `c` on((`p`.`clotth_id` = `c`.`id`))) join `inventory`.`size` `s` on((`p`.`size_id` = `s`.`id`))) where (`p`.`status` = '1') order by `p`.`registered_date` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllSizes`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllSizes` AS select `inventory`.`size`.`id` AS `id`,`inventory`.`size`.`size_name` AS `size_name` from `inventory`.`size` order by `inventory`.`size`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewAllSuppliers`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewAllSuppliers` AS select `inventory`.`supplier`.`id` AS `id`,`inventory`.`supplier`.`name` AS `name`,`inventory`.`supplier`.`contactNo1` AS `contactNo1`,`inventory`.`supplier`.`contactNo2` AS `contactNo2`,`inventory`.`supplier`.`address` AS `address`,`inventory`.`supplier`.`rating` AS `rating`,`inventory`.`supplier`.`email` AS `email`,date_format(`inventory`.`supplier`.`registered_date`,'%m-%d-%Y') AS `registered_date`,`inventory`.`supplier`.`userid` AS `userid` from `inventory`.`supplier` where (`inventory`.`supplier`.`status` = 1) order by `inventory`.`supplier`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewGRN`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewGRN` AS select 'GRN' AS `GRN`,`inventory`.`grn`.`id` AS `id`,`inventory`.`grn`.`ref_no` AS `ref_no`,`inventory`.`grn`.`invoice_issueddate` AS `invoice_issueddate`,`inventory`.`grn`.`supplier_id` AS `supplier_id`,`inventory`.`grn`.`payment_type_grn_id` AS `grn_id`,`inventory`.`grn`.`total_qty` AS `total_qty`,`inventory`.`grn`.`total` AS `total`,`inventory`.`grn`.`discount` AS `discount`,`inventory`.`grn`.`paid_amount` AS `paid_amount`,`inventory`.`grn`.`due_amount` AS `due_amount`,`inventory`.`grn`.`issued_time` AS `issued_time`,`inventory`.`grn`.`userid` AS `userid` from `inventory`.`grn` where (`inventory`.`grn`.`status` = 1) order by `inventory`.`grn`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewGRNProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewGRNProducts` AS select `s`.`grn_id` AS `grn_id`,`p`.`id` AS `pid`,`p`.`product_description` AS `product_description`,`s`.`id` AS `id`,`s`.`available_qty` AS `available_qty`,`s`.`qty` AS `qty`,`s`.`return_status` AS `return_status`,`s`.`return_qty` AS `return_qty`,`s`.`buying_price` AS `buying_price`,`s`.`selling_price` AS `selling_price` from ((`inventory`.`stock` `s` join `inventory`.`grn` `g` on((`s`.`grn_id` = `g`.`id`))) join `inventory`.`product` `p` on((`s`.`product_id` = `p`.`id`))) order by `g`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewGRNReturnProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewGRNReturnProducts` AS select `g`.`id` AS `grnid`,`p`.`id` AS `product_id`,`p`.`product_description` AS `product_description`,`str`.`qty` AS `qty`,`st`.`issued_time` AS `issued_time`,`st`.`reason` AS `reason` from ((((`inventory`.`grn` `g` join `inventory`.`stock` `s` on((`g`.`id` = `s`.`grn_id`))) join `inventory`.`product` `p` on((`s`.`product_id` = `p`.`id`))) join `inventory`.`stock_return` `st` on((`st`.`grnid` = `g`.`id`))) join `inventory`.`stock_return_reg` `str` on((`st`.`id` = `str`.`stock_return_id`)));

-- -----------------------------------------------------
-- View `inventory`.`viewInvoiceProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewInvoiceProducts` AS select `inventory`.`stock`.`id` AS `id`,`inventory`.`stock`.`available_qty` AS `available_qty`,`inventory`.`stock`.`selling_price` AS `selling_price`,`viewAllProducts`.`product_description` AS `product_description` from ((`inventory`.`stock` left join `inventory`.`grn` on((`inventory`.`stock`.`grn_id` = `inventory`.`grn`.`id`))) left join `inventory`.`viewAllProducts` on((`inventory`.`stock`.`product_id` = `viewAllProducts`.`id`))) where ((`inventory`.`grn`.`status` = 1) and (`inventory`.`stock`.`available_qty` > 0)) order by `inventory`.`stock`.`id`;

-- -----------------------------------------------------
-- View `inventory`.`viewInvoices`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewInvoices` AS select 'INV' AS `INV`,`inventory`.`invoice`.`id` AS `id`,`inventory`.`invoice`.`customer_id` AS `customer_id`,`inventory`.`invoice`.`payment_type_invoice_id` AS `payment_type_invoice_id`,`inventory`.`invoice`.`qty` AS `qty`,`inventory`.`invoice`.`discount` AS `discount`,`inventory`.`invoice`.`total` AS `total`,`inventory`.`invoice`.`issued_date` AS `issued_date`,`inventory`.`invoice`.`return` AS `return`,`inventory`.`invoice`.`gift` AS `gift`,`inventory`.`invoice`.`userid` AS `userid`,`inventory`.`invoice`.`status` AS `status`,`inventory`.`invoice`.`paid_amount` AS `paid_amount`,`inventory`.`invoice`.`gross_amount` AS `gross_amount`,`inventory`.`payment_type_invoice`.`type` AS `payment_type` from (`inventory`.`invoice` left join `inventory`.`payment_type_invoice` on((`inventory`.`invoice`.`payment_type_invoice_id` = `inventory`.`payment_type_invoice`.`id`))) where (`inventory`.`invoice`.`status` = 1) order by `inventory`.`invoice`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewReturnProducts`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewReturnProducts` AS select `inventory`.`stock`.`id` AS `id`,`inventory`.`stock`.`available_qty` AS `available_qty`,`inventory`.`stock`.`selling_price` AS `selling_price`,`viewAllProducts`.`product_description` AS `product_description` from ((`inventory`.`stock` left join `inventory`.`grn` on((`inventory`.`stock`.`grn_id` = `inventory`.`grn`.`id`))) left join `inventory`.`viewAllProducts` on((`inventory`.`stock`.`product_id` = `viewAllProducts`.`id`))) where (`inventory`.`grn`.`status` = 1) order by `inventory`.`stock`.`id`;

-- -----------------------------------------------------
-- View `inventory`.`viewSalesReturn`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewSalesReturn` AS select 'SRE' AS `SRE`,`inventory`.`sales_return`.`id` AS `id`,`inventory`.`sales_return`.`status` AS `status`,`inventory`.`sales_return`.`issued_date` AS `issued_date`,`inventory`.`sales_return`.`total` AS `total` from `inventory`.`sales_return` where (`inventory`.`sales_return`.`status` = 1) order by `inventory`.`sales_return`.`id` desc;

-- -----------------------------------------------------
-- View `inventory`.`viewTodayInvoiceIds`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewTodayInvoiceIds` AS select `inventory`.`invoice`.`id` AS `id` from `inventory`.`invoice` where ((cast(`inventory`.`invoice`.`issued_date` as date) = cast(now() as date)) and (`inventory`.`invoice`.`status` <> '0')) order by `inventory`.`invoice`.`id`;

-- -----------------------------------------------------
-- View `inventory`.`viewTodayReturnIds`
-- -----------------------------------------------------
CREATE VIEW `inventory`.`viewTodayReturnIds` AS select `inventory`.`sales_return`.`id` AS `id` from `inventory`.`sales_return` where ((cast(`inventory`.`sales_return`.`issued_date` as date) = cast(now() as date)) and (`inventory`.`sales_return`.`status` <> '0')) order by `inventory`.`sales_return`.`id`;
