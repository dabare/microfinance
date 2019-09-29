USE `inventory`;

DELIMITER $$
USE `inventory`$$
CREATE
    TRIGGER `inventory`.`stockProductRatingAndAvailableQty`
    AFTER UPDATE ON `inventory`.`stock`
    FOR EACH ROW
BEGIN
    UPDATE product SET product.rating = product.rating +
                                        (
                                                    (SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'prod_points') *
                                                    OLD.available_qty - NEW.available_qty
                                            ),

                       product.available_qty = product.available_qty - (OLD.available_qty - NEW.available_qty)

    WHERE product.id = NEW.product_id;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`invoiceLoyalityPoints`
    AFTER UPDATE ON `inventory`.`invoice`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE stock_id INT(64);
    DECLARE inv_qty INT(64);
    DECLARE inv_stocks CURSOR FOR SELECT invoice_has_stock.stock_id, invoice_has_stock.qty FROM invoice_has_stock WHERE invoice_has_stock.invoice_id = NEW.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF (OLD.status = 3 AND NEW.status = 1) THEN
        OPEN inv_stocks;
        ins_loop: LOOP
            FETCH inv_stocks INTO stock_id, inv_qty;
            IF done = 1 THEN
                LEAVE ins_loop;
            END IF;

            UPDATE supplier
            SET supplier.rating = supplier.rating + ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'sup_points') * inv_qty)
            WHERE supplier.id = (SELECT grn.supplier_id FROM stock LEFT JOIN grn ON stock.grn_id = grn.id WHERE stock.id = stock_id);

        END LOOP ins_loop;
        CLOSE inv_stocks;

        IF NEW.customer_id <> 1 THEN
            UPDATE customer set customer.points = customer.points + ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'cus_points') * NEW.total)
            WHERE customer.id = NEW.customer_id;
        END IF;

    ELSEIF (OLD.status = 1 AND NEW.status = 4) THEN
        OPEN inv_stocks;
        ins_loop: LOOP
            FETCH inv_stocks INTO stock_id, inv_qty;
            IF done = 1 THEN
                LEAVE ins_loop;
            END IF;

            UPDATE supplier
            SET supplier.rating = supplier.rating - ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'sup_points') * inv_qty)
            WHERE supplier.id = (SELECT grn.supplier_id FROM stock LEFT JOIN grn ON stock.grn_id = grn.id WHERE stock.id = stock_id);

        END LOOP ins_loop;
        CLOSE inv_stocks;

        IF NEW.customer_id <> 1 THEN
            UPDATE customer set customer.points = customer.points - ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'cus_points') * NEW.total)
            WHERE customer.id = NEW.customer_id;
        END IF;

    END IF;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`invoiceStockUpdate`
    AFTER UPDATE ON `inventory`.`invoice`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE stock_id INT(64);
    DECLARE inv_qty INT(64);
    DECLARE inv_stocks CURSOR FOR SELECT invoice_has_stock.stock_id, invoice_has_stock.qty FROM invoice_has_stock WHERE invoice_has_stock.invoice_id = NEW.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF (OLD.status = 3 AND NEW.status = 1) THEN
        OPEN inv_stocks;
        ins_loop: LOOP
            FETCH inv_stocks INTO stock_id, inv_qty;
            IF done = 1 THEN
                LEAVE ins_loop;
            END IF;
            UPDATE stock SET stock.available_qty = stock.available_qty - inv_qty WHERE stock.id = stock_id;
        END LOOP ins_loop;
        CLOSE inv_stocks;

    ELSEIF (OLD.status = 1 AND NEW.status = 4) THEN
        OPEN inv_stocks;
        ins_loop: LOOP
            FETCH inv_stocks INTO stock_id, inv_qty;
            IF done = 1 THEN
                LEAVE ins_loop;
            END IF;
            UPDATE stock SET stock.available_qty = stock.available_qty + inv_qty WHERE stock.id = stock_id;
        END LOOP ins_loop;
        CLOSE inv_stocks;
    END IF;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`sales_returnLoyalityPoints`
    AFTER UPDATE ON `inventory`.`sales_return`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE stock_id INT(64);
    DECLARE ret_qty INT(64);
    DECLARE ret_stocks CURSOR FOR SELECT sales_return_reg.stock_id, sales_return_reg.qty FROM sales_return_reg WHERE sales_return_reg.sales_return_id = NEW.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF (OLD.status = 3 AND NEW.status = 1) THEN

        OPEN ret_stocks;
        ret_loop: LOOP
            FETCH ret_stocks INTO stock_id, ret_qty;
            IF done = 1 THEN
                LEAVE ret_loop;
            END IF;

            UPDATE supplier
            SET supplier.rating = supplier.rating - ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'sup_points') * ret_qty)
            WHERE supplier.id = (SELECT grn.supplier_id FROM stock LEFT JOIN grn ON stock.grn_id = grn.id WHERE stock.id = stock_id);
        END LOOP ret_loop;
        CLOSE ret_stocks;

    ELSEIF (OLD.status = 1 AND NEW.status = 4) THEN

        OPEN ret_stocks;
        ret_loop: LOOP
            FETCH ret_stocks INTO stock_id, ret_qty;
            IF done = 1 THEN
                LEAVE ret_loop;
            END IF;

            UPDATE supplier
            SET supplier.rating = supplier.rating + ((SELECT shop_settings.value + 0.0 AS points FROM shop_settings WHERE shop_settings.key = 'sup_points') * ret_qty)
            WHERE supplier.id = (SELECT grn.supplier_id FROM stock LEFT JOIN grn ON stock.grn_id = grn.id WHERE stock.id = stock_id);
        END LOOP ret_loop;
        CLOSE ret_stocks;

    END IF;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`sales_returnStockUpdate`
    AFTER UPDATE ON `inventory`.`sales_return`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE stock_id INT(64);
    DECLARE ret_qty INT(64);
    DECLARE ret_stocks CURSOR FOR SELECT sales_return_reg.stock_id, sales_return_reg.qty FROM sales_return_reg WHERE sales_return_reg.sales_return_id = NEW.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    IF (OLD.status = 3 AND NEW.status = 1) THEN
        OPEN ret_stocks;
        ret_loop: LOOP
            FETCH ret_stocks INTO stock_id, ret_qty;
            IF done = 1 THEN
                LEAVE ret_loop;
            END IF;
            UPDATE stock SET stock.available_qty = stock.available_qty + ret_qty WHERE stock.id = stock_id;
        END LOOP ret_loop;
        CLOSE ret_stocks;

    ELSEIF (OLD.status = 1 AND NEW.status = 4) THEN
        OPEN ret_stocks;
        ret_loop: LOOP
            FETCH ret_stocks INTO stock_id, ret_qty;
            IF done = 1 THEN
                LEAVE ret_loop;
            END IF;
            UPDATE stock SET stock.available_qty = stock.available_qty - ret_qty WHERE stock.id = stock_id;
        END LOOP ret_loop;
        CLOSE ret_stocks;
    END IF;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`invoice_has_stock_Insert`
    BEFORE INSERT ON `inventory`.`invoice_has_stock_insert`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE id INT(64);
    DECLARE inv_stocks CURSOR FOR
        SELECT invoice_has_stock.id
        FROM invoice_has_stock
        WHERE invoice_has_stock.invoice_id = NEW.invoice_id AND invoice_has_stock.stock_id = NEW.stock_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    IF NEW.stock_id not in (
        SELECT invoice_has_stock.stock_id
        FROM invoice_has_stock
        WHERE invoice_has_stock.invoice_id = NEW.invoice_id
    )
    THEN -- MISSING THEN
        INSERT INTO invoice_has_stock(invoice_id, stock_id, qty, price, amount, product_description)
        VALUES (NEW.invoice_id, NEW.stock_id, NEW.qty, NEW.price, NEW.amount, NEW.product_description);
    ELSE
        OPEN inv_stocks;
        ins_loop: LOOP
            FETCH inv_stocks INTO id;
            IF done = 1 THEN
                LEAVE ins_loop;
            END IF;
            UPDATE invoice_has_stock
            SET
                invoice_has_stock.qty = invoice_has_stock.qty + NEW.qty,
                invoice_has_stock.amount = invoice_has_stock.qty * price
            WHERE invoice_has_stock.id = id;
        END LOOP ins_loop;
        CLOSE inv_stocks;
    END IF;
END$$

USE `inventory`$$
CREATE
    TRIGGER `inventory`.`sales_return_reg_insert`
    BEFORE INSERT ON `inventory`.`sales_return_reg_insert`
    FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE id INT(64);
    DECLARE ret_stocks CURSOR FOR
        SELECT sales_return_reg.id
        FROM sales_return_reg
        WHERE sales_return_reg.sales_return_id = NEW.sales_return_id AND sales_return_reg.stock_id = NEW.stock_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    IF NEW.stock_id not in (
        SELECT sales_return_reg.stock_id
        FROM sales_return_reg
        WHERE sales_return_reg.sales_return_id = NEW.sales_return_id
    )
    THEN -- MISSING THEN
        INSERT INTO sales_return_reg(sales_return_id, stock_id, qty, selling_price, amount, product_description)
        VALUES (NEW.sales_return_id, NEW.stock_id, NEW.qty, NEW.selling_price, NEW.amount, NEW.product_description);
    ELSE
        OPEN ret_stocks;
        ret_loop: LOOP
            FETCH ret_stocks INTO id;
            IF done = 1 THEN
                LEAVE ret_loop;
            END IF;
            UPDATE sales_return_reg SET
                                        sales_return_reg.qty = sales_return_reg.qty + NEW.qty,
                                        sales_return_reg.amount = sales_return_reg.qty * sales_return_reg.selling_price
            WHERE sales_return_reg.id = id;
        END LOOP ret_loop;
        CLOSE ret_stocks;
    END IF;
END$$


DELIMITER ;
