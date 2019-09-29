import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MiddlewareService } from '../../../middleware.service';
@Injectable({
  providedIn: 'root'
})

export class GRNListService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
    // environment.apiUrl = 'http://localhost:8080';
  } 
  getAllGRNs() {
    return this.middlewareService.select('viewAllGRN', '', '', '');
  }
  getGRNProduct(id) {
    return this.middlewareService.select('viewGRNProducts', 'grn_id=\'' + id + '\' ', '', '\'grn_id asc\'');
  }

  getviewGRNReturnProducts(id) {
    return this.middlewareService.select('viewGRNReturnProducts', 'grnid=\'' + id + '\' ', '', '\'grnid asc\'');
  }

  getNewStockReturnId() {
    return this.middlewareService.select('getNewStockReturnId', '', '', '\'id asc\'');
  }
  insertReturnTotal(return_regi: any) {

    return this.middlewareService.insert('stock_return',
    'id,reason, total_qty, total, status, grnid',
      '(\'' + return_regi.id + '\',\'' + return_regi.reason + '\',\'' + return_regi.total_qty + '\',\'' + return_regi.total + '\', \'' + return_regi.status + '\', \'' + return_regi.grnid + '\'  )',
    );
  }

  insertReturnRegi(return_products: any) {

    return this.middlewareService.insert('stock_return_reg',
    'stock_id, qty, stock_return_id, status',
      '(\'' + return_products.stock_id + '\',\'' + return_products.return_qty + '\',\'' + return_products.stock_return_id + '\', \'' + return_products.status + '\'  )',
    );
  }
  updateStockQty(return_products: any) { 
    var qty = Number(return_products.qty)-Number( return_products.return_qty);
    var avai_qty = Number(return_products.available_qty) -Number( return_products.return_qty);
    return this.middlewareService.update('stock',
      'qty=\'' + qty + '\',  available_qty=\'' + avai_qty + '\'',
      'id = \'' + return_products.stock_id + '\'');
  }
  updateProductAvailableQty(return_products: any) { 
    var qty = Number(return_products.available_qty) -Number( return_products.return_qty);
    return this.middlewareService.update('product',
      'available_qty=\'' + qty + '\' ',
      'id = \'' + return_products.id+ '\'');
  }
  updatePayment(grn: any) { 

    return this.middlewareService.update('grn',
      'paid_amount=\'' + grn.pay_amount + '\',  due_amount=\'' + grn.current_due + '\'',
      'id = \'' + grn.id + '\'');
  }
  insertPaymentHistory(grn: any) {

    return this.middlewareService.insert('grn_payment_history',
    'paid_amount, note, grnid',
      '(\'' + grn.pay_amount  + '\',\'' + grn.notes  + '\',\'' + grn.id + '\' )',
    );
  }
  getPaymentHistory(id) {
    return this.middlewareService.select('grn_payment_history', 'grnid=\'' + id + '\' ', '', '\'id asc\'');
  }
}
