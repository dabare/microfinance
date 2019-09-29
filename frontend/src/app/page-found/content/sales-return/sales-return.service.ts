import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';

@Injectable({
  providedIn: 'root'
})

export class SalesReturnService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  getReturnProducts() {
    return this.middlewareService.select('viewReturnProducts', '', '', '');
  }

  newReturn() {
    return this.middlewareService.insert('sales_return', 'status',
      '(\'3\')');
  }

  addProductToReturn(product) {
    return this.middlewareService.insert('sales_return_reg_insert',
      'sales_return_id, stock_id, qty, selling_price, amount, product_description',
      '(\'' + product.sales_return_id + '\', \'' + product.stock_id + '\', \'' + product.qty + '\', \'' +
      product.selling_price + '\', \'' + product.amount + '\', \'' + product.product_description + '\' )');
  }

  getProductsOfAReturn(ret) {
    return this.middlewareService.select('sales_return_reg', 'sales_return_id=\'' + ret.id + '\'', '', 'id ASC');
  }

  updateProductOfAReturn(product) {
    return this.middlewareService.update('sales_return_reg',
      'qty=\'' + product.qty + '\' , selling_price=\'' + product.selling_price + '\' , amount=\'' + product.amount + '\' ',
      'id = \'' + product.id + '\'');
  }

  cancleReturn(ret) {
    return this.middlewareService.update('sales_return',
      'status=\'4\'',
      'id = \'' + ret.id + '\'');
  }

  updateStockQty(product) {
    return this.middlewareService.update('stock',
      'available_qty=\'' + product.available_qty + '\'',
      'id =\'' + product.id + '\'');
  }

  getTodayReturns() {
    return this.middlewareService.select('viewTodayReturnIds', '', '', '');
  }

  getReturn(id) {
    return this.middlewareService.select('sales_return', 'id=\'' + id + '\'', '', '');
  }

  getStockInHand(id) {
    return this.middlewareService.select('stock', 'id=\'' + id + '\'', '', '');
  }

  doneReturn(ret) {
    return this.middlewareService.update('sales_return',
      'status=\'1\', issued_date=NOW()',
      'id =\'' + ret.id + '\'');
  }

  updateReturn(ret) {
    return this.middlewareService.update('sales_return',
      'total=\'' + ret.total + '\'',
      'id =\'' + ret.id + '\'');
  }
}
