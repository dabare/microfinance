INSERT INTO `customer` (`id`, `name`, `contactNo1`, `contactNo2`, `address`, `email`, `dob`, `points`, `userid`, `status`) VALUES (1, 'Walk In Customer', '-', '-', '-', '-', '0000-00-00', 0, 1, 1);
INSERT INTO `shop_settings` (`id`, `key`, `value`, `description`) VALUES (1, 'cus_points', '0.01', 'Customer loyalty points by percentage per invoice total');
INSERT INTO `shop_settings` (`id`, `key`, `value`, `description`) VALUES (2, 'sup_points', '1', 'Supplier rating by percentage per invoice product');
INSERT INTO `shop_settings` (`id`, `key`, `value`, `description`) VALUES (3, 'prod_points', '1', 'Product rating by percentage per invoice product');
INSERT INTO `status_codes` (`id`, `value`, `description`) VALUES (1, 0, 'not active');
INSERT INTO `status_codes` (`id`, `value`, `description`) VALUES (2, 1, 'active');
INSERT INTO `status_codes` (`id`, `value`, `description`) VALUES (3, 3, 'still in process');
INSERT INTO `status_codes` (`id`, `value`, `description`) VALUES (4, 4, 'cancled');
INSERT INTO `user_type` (`id`, `type`, `status`) VALUES (1, 'Frontend User', 1);
INSERT INTO `user_type` (`id`, `type`, `status`) VALUES (2, 'Backend User', 1);
INSERT INTO `user_type` (`id`, `type`, `status`) VALUES (3, 'Admin', 1);
INSERT INTO `user_type` (`id`, `type`, `status`) VALUES (13, 'Super Admin', 1);

INSERT INTO `size` (`id`, `size_name`, `status`) VALUES (1, 'L', 1);
INSERT INTO `size` (`id`, `size_name`, `status`) VALUES (2, 'M', 1);
INSERT INTO `size` (`id`, `size_name`, `status`) VALUES (3, 'XS', 1);

INSERT INTO `payment_type_invoice` (`id`, `type`, `status`) VALUES (1, 'CASH', 1);
INSERT INTO `payment_type_invoice` (`id`, `type`, `status`) VALUES (2, 'CREDIT', 1);
INSERT INTO `payment_type_invoice` (`id`, `type`, `status`) VALUES (3, 'CHEQUE', 1);

INSERT INTO `payment_type_grn` (`id`, `type`, `status`) VALUES (1, 'CASH', 1);
INSERT INTO `payment_type_grn` (`id`, `type`, `status`) VALUES (2, 'CREDIT', 1);
INSERT INTO `payment_type_grn` (`id`, `type`, `status`) VALUES (3, 'CHEQUE', 1);

INSERT INTO `user` (`id`, `name`, `contactNo`, `username`, `password`, `user_type_id`, `userid`, `status`, `email`) VALUES (1, 'madhava', '0774457794', 'superadmin', 'superadmin', 13, 1, 1, 'dabareisnow@gmail.com');
