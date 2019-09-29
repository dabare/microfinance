import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MiddlewareService } from '../../../middleware.service';
@Injectable({
  providedIn: 'root'
})

export class DiscountService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
    // environment.apiUrl = 'http://localhost:8080';
  }

  // getAllSuppliers() {
  //   return this.httpClient.get(environment.apiUrl + '/getAllSuppliers');
  // }

  // insertSupplier(supplier: any) {
  //   return this.httpClient.post(environment.apiUrl + '/insertSupplier', supplier);
  // }

  // updateSupplier(supplier: any) {
  //   return this.httpClient.post(environment.apiUrl + '/updateSupplier', supplier);
  // }

  // deleteSupplier(supplier: any) {
  //   return this.httpClient.post(environment.apiUrl + '/deleteSupplier', supplier);
  // }
  viewAllDiscounts() {
    return this.middlewareService.select('viewAllDiscounts', '', '', '\'id asc\'');
  }
  getNewDiscount() {
    return this.middlewareService.select('getNewDiscount', '', '', '\'id asc\'');
  }
  getEachDiscounts(i) {
    return this.middlewareService.select('viewAllDiscounts', 'id=\'' + i + '\' ', '', '\'id asc\'');
  }
  getAllProducts() {
    return this.middlewareService.select('getStockProducts', '', '', '\'id asc\'');
  }
  getAllSelectProduct() {
    return this.middlewareService.select('viewAllProducts', '', '', '\'id asc\'');
  }
  getStockProducts(i) {
    return this.middlewareService.select('getStockProducts', 'sid=\'' + i + '\' ', '', '\'id asc\'');
  }
  insertDiscout(discount: any) {
    return this.middlewareService.insert('discount',
      'id,type, name, discount_percentage, from_date, to_date, status,userid',
      '(\'' + discount.id + '\',\'' + discount.type + '\',\'' + discount.name + '\',\'' + discount.discount_percentage + '\', \'' + discount.from_date + '\', \'' + discount.to_date + '\', \'' + discount.status + '\',  \'' + discount.userid + '\' )',
    );
  }
  insertDiscountStock(dicount_produt: any) {
    return this.middlewareService.insert('product_has_discount',
      'product_id,discount_id,status,stockid',
      '(\'' + dicount_produt.pid + '\',\'' + dicount_produt.discountid + '\',\'' + dicount_produt.status + '\',\'' + dicount_produt.sid + '\' )',
    );
  }
  updateSellingPrice(dicount_produt: any) {
    return this.middlewareService.update('Stock',
      'selling_price=\'' + dicount_produt.selling_price + '\'',
      'id=\'' + dicount_produt.sid + '\' ',
    );
  }
  getDiscountProducts(i) {
    return this.middlewareService.select('getDiscountedProducts', 'did=\'' + i + '\' ', '', '');
  }

  updateDiscout(discount: any) {
    return this.middlewareService.update('discount',
      'type=\'' + discount.type + '\',name=\'' + discount.name + '\',discount_percentage=\'' + discount.discount_percentage + '\', from_date=\'' + discount.from_date + '\',to_date=\'' + discount.to_date + '\', status=\'' + discount.status + '\'',
      'id=\'' + discount.id + '\' ',
      );
  }


  deleteStockProduct(i) {
    return this.middlewareService.deletee('product_has_discount',
      'discount_id=\'' + i + '\' '
    );
  }
  updateSupplier(supplier: any) {
    return this.middlewareService.update('supplier',
      'name=\'' + supplier.name + '\', contactNo1=\'' + supplier.contactNo1 + '\', contactNo2=\'' + supplier.contactNo2 + '\', address=\'' + supplier.address + '\', email=\'' + supplier.email + '\', rating=\'' + supplier.rating + '\'',
      'id=\'' + supplier.id + '\' ',
    );
  }

  deleteDiscount(i) {
    return this.middlewareService.update('discount',
      'status=\'0\'',
      'id=\'' + i + '\' ',
    );
  }

}
