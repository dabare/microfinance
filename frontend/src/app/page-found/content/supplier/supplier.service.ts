import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
@Injectable({
  providedIn: 'root'
})

export class SupplierService {

  constructor(private httpClient: HttpClient,private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  } 
  getAllSuppliers() {   
    return this.middlewareService.select('viewAllSuppliers', '', '', '');
  }
  getSupplierName(sid) {   
    return this.middlewareService.select('viewAllSuppliers',  'id=\'' + sid + '\' ', '', '');
  }

  insertSupplier(supplier: any) {  
    return this.middlewareService.insert('supplier',
    'name, contactNo1, contactNo2, address, email, rating,userid',
    '(\'' + supplier.name + '\', \'' + supplier.contactNo1 + '\', \'' + supplier.contactNo2 + '\', \'' + supplier.address + '\', \'' + supplier.email + '\', \'' + supplier.rating + '\', \'' + supplier.userid + '\' )',
  ); 
  
  }

  updateSupplier(supplier: any) { 
  return this.middlewareService.update('supplier',
  'name=\'' + supplier.name + '\', contactNo1=\'' + supplier.contactNo1 + '\', contactNo2=\'' + supplier.contactNo2 + '\', address=\'' + supplier.address + '\', email=\'' + supplier.email + '\', rating=\'' + supplier.rating + '\'',
  'id=\'' + supplier.id + '\' ',
);
  }

  deleteSupplier(supplier: any) {
    return this.middlewareService.update('supplier',
      'status=\'0\'',
      'id=\'' + supplier.id + '\' ',
    );
  }
  getSupplierTotalRating() {
    return this.middlewareService.select('getTotalSupplierRating','', '', '');
  }
  getlastInsertId() {
    return this.middlewareService.select('getMaxSupplierId','', '', '');
  }
}
