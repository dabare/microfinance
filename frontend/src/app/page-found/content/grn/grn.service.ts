import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MiddlewareService } from '../../../middleware.service';
import { NgbModalWindow } from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
@Injectable({
  providedIn: 'root'
})

export class GRNService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
    environment.printingApiUrl = 'http://localhost:65456';
  }



  getAllPaymentTypeGRN() {
    return this.middlewareService.select('viewAllPaymentTypeGrn', '', '', '\'id desc\'');
  }
  getAllPaymentTypName(pid) {
    return this.middlewareService.select('viewAllPaymentTypeGrn', 'id=\'' + pid + '\' ', '', '\'id desc\'');
  }
  getNewGRNId() {
    return this.middlewareService.select('getNewGRNId', '', '', '\'id asc\'');
  }

  ///////////////////////////////// GRN 
  insertGRN(grn_regi: any) {

    return this.middlewareService.insert('grn',
      'id,ref_no, invoice_issueddate,supplier_id, payment_type_grn_id, total_qty,total,discount, paid_amount,due_amount, userid,notes',
      '(\'' + grn_regi.grn.id + '\',\'' + grn_regi.grn.ref_no + '\',\'' + grn_regi.grn.invoice_issueddate + '\', \'' + grn_regi.supplier.id + '\', \'' + grn_regi.paymentType.id + '\', \'' + grn_regi.product.total_qty + '\',  \'' + grn_regi.product.total + '\',  \'' + grn_regi.product.discount + '\',\'' + grn_regi.product.paid_amount + '\',\'' + grn_regi.product.due_amount + '\', \'' + grn_regi.product.userid + '\', \'' + grn_regi.product.notes + '\' )',
    );
  }
  ///////////////////////////////// Stock 
  insertStock(stock: any) {
    var id =  this.IDGenerator();
    
    console.log(id);
    // return this.middlewareService.insert('stock',
    //   'id,grn_id,product_id, qty,available_qty, buying_price, selling_price,profit_percentage',
    //   '(\'' + id+ '\',\'' + stock.grn_id + '\',\'' + stock.id + '\',\'' + stock.qty + '\', \'' + stock.qty + '\', \'' + stock.buying_price + '\', \'' + stock.selling_price + '\',  \'' + 0 + '\' )',
    // );
    return this.middlewareService.insert('stock',
      'grn_id,product_id, qty,available_qty, buying_price, selling_price,profit_percentage',
      '(\'' + stock.grn_id + '\',\'' + stock.id + '\',\'' + stock.qty + '\', \'' + stock.qty + '\', \'' + stock.buying_price + '\', \'' + stock.selling_price + '\',  \'' + 0 + '\' )',
    );
  }

   IDGenerator() {
	 
   var length = 8;
   var timestamp = +new Date;
    
    var _getRandomInt = function( min, max ) {
     return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }
        var ts =  timestamp.toString();
      var parts = ts.split( "" ).reverse();
      var id = "";
      
      for( var i = 0; i < length; ++i ) {
       var index = _getRandomInt( 0, parts.length - 1 );
       id += parts[index];	 
      }
      
      return id;
  }
  
  updateProductAvailableQty(stock: any) { 
    var qty = Number(stock.available_qty) +Number( stock.qty);
    return this.middlewareService.update('product',
      'available_qty=\'' + qty + '\' ',
      'id = \'' + stock.id + '\'');
  }


  printGRN(printObjects: any){
    return this.httpClient.post(environment.printingApiUrl + '/util/print',printObjects);
  } 
}
