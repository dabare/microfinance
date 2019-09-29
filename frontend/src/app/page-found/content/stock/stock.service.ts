import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import { MiddlewareService } from 'src/app/middleware.service';

@Injectable({
  providedIn: 'root'
})

export class StockService {

  constructor(private httpClient: HttpClient,private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  }


  getAllStockProduct() {
    return this.middlewareService.select('getStockReport', '', '', '');
  } 

  deleteProduct(product: any) {
    return this.middlewareService.update('product',
    'status=\'0\'',
    'id=\'' + product.id + '\' ',
  );
  }
 
}
