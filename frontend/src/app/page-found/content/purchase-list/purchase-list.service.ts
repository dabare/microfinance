import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';

@Injectable({
  providedIn: 'root'
})

export class PurchaseListService {
  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  getAllGrns() {
    return this.middlewareService.select('viewGRN', '', '', '',);
  }

  getStockReturn(){
    return this.middlewareService.select('ViewStockReturns','','','');
  }
}
