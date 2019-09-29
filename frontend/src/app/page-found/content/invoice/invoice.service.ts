import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
import {LoginService} from '../../../login/login.service';
import {PrinterService} from '../../../printer.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService, private loginService: LoginService,
              private printerService: PrinterService) {
  }

  getAllCustomers() {
    return this.middlewareService.select('viewAllCustomers', '', '', '\'id asc\'');
  }

  getNewInvoiceId() {
    return this.middlewareService.select('getNewInvoiceId', '', '', '');
  }

  getPaymentTypesInvoice() {
    return this.middlewareService.select('viewAllPaymentTypesInvoice', '', '', '');
  }

  getInvoiceProducts() {
    return this.middlewareService.select('viewInvoiceProducts', '', '', '');
  }

  newInvoice(invoice) {
    return this.middlewareService.insert('invoice', 'customer_id, userid',
      '(\'' + invoice.customer_id + '\', \'' + this.loginService.getUser().id + '\')');
  }

  addProductToInvoice(product) {
    return this.middlewareService.insert('invoice_has_stock_insert', 'invoice_id, stock_id, qty, price, amount, product_description',
      '(\'' + product.invoice_id + '\', \'' + product.stock_id + '\', \'' + product.qty + '\', \'' +
      product.price + '\', \'' + product.amount + '\', \'' + product.product_description + '\' )');
  }

  getNewInvoiceProductId() {
    return this.middlewareService.select('getNewInvoiceProductId', '', '', '');
  }

  getProductsOfAnInvoice(invoice) {
    return this.middlewareService.select('invoice_has_stock', 'invoice_id=\'' + invoice.id + '\'', '', 'id ASC');
  }

  updateProductOfAnInvoice(product) {
    return this.middlewareService.update('invoice_has_stock',
      'qty=\'' + product.qty + '\' , price=\'' + product.price + '\' , amount=\'' + product.amount + '\' ',
      'id = \'' + product.id + '\'');
  }

  cancleInvoice(invoice) {
    return this.middlewareService.update('invoice',
      'status=\'4\'',
      'id = \'' + invoice.id + '\'');
  }

  updateStockQty(product) {
    return this.middlewareService.update('stock',
      'available_qty=\'' + product.available_qty + '\'',
      'id =\'' + product.id + '\'');
  }

  getSupplierProduct(product) {
    return this.middlewareService.select('getProductSupplier', 'stockid=\'' + product.id + '\' ', '', '\'id asc\'');
  }

  getTodayInvoices() {
    return this.middlewareService.select('viewTodayInvoiceIds', '', '', '');
  }

  insertCustomer(customer: any) {
    return this.middlewareService.insert('customer',
      'name, contactNo1, contactNo2, address, email, dob, points',
      '(\'' + customer.name + '\', \'' + customer.contactNo1 + '\', \'' + customer.contactNo2 +
      '\', \'' + customer.address + '\', \'' + customer.email + '\', \'' + customer.dob + '\', \'' + customer.points + '\' )',
    );
  }

  getNewCustomerId() {
    return this.middlewareService.select('getNewCustomerId', '', '', '');
  }

  updatePaiedInvoice(invoice) {
    return this.middlewareService.update('invoice',
      'status=1, payment_type_invoice_id=\'' + invoice.payment_type_invoice_id + '\', customer_id=\'' + invoice.customer_id + '\'' +
      ', qty=\'' + invoice.qty + '\', discount=\'' + invoice.discount + '\', total=\'' + invoice.total + '\'' +
      ', paid_amount=\'' + invoice.paid_amount + '\', gross_amount=\'' + invoice.gross_amount + '\', issued_date=NOW()',
      'id =\'' + invoice.id + '\'');
  }

  updateInvoiceCustomer(invoice) {
    return this.middlewareService.update('invoice',
      'customer_id=\'' + invoice.customer_id + '\'',
      'id =\'' + invoice.id + '\'');
  }

  updateInvoicePaymentMethod(invoice) {
    return this.middlewareService.update('invoice',
      'payment_type_invoice_id=\'' + invoice.payment_type_invoice_id + '\'',
      'id =\'' + invoice.id + '\'');
  }

  getInvoice(id) {
    return this.middlewareService.select('invoice', 'id=\'' + id + '\'', '', '');
  }

  getStockInHand(id) {
    return this.middlewareService.select('stock', 'id=\'' + id + '\'', '', '');
  }

  updateInvoice(invoice) {
    return this.middlewareService.update('invoice',
      'payment_type_invoice_id=\'' + invoice.payment_type_invoice_id + '\', customer_id=\'' + invoice.customer_id + '\'' +
      ', qty=\'' + invoice.qty + '\', discount=\'' + invoice.discount + '\', total=\'' + invoice.total + '\'' +
      ', paid_amount=\'' + invoice.paid_amount + '\', gross_amount=\'' + invoice.gross_amount + '\', issued_date=NOW()',
      'id =\'' + invoice.id + '\'');
  }

  getAllPaymentTypName(pid) {
    return this.middlewareService.select('viewAllPaymentTypesInvoice', 'id=\'' + pid + '\' ', '', '\'id desc\'');
  }

  printInvoice(data: any) {
    return this.printerService.print('customer_invoice.odt', data);
  }
}
