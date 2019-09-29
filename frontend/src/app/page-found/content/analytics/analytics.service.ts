import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { MiddlewareService } from '../../../middleware.service';
import { NgbModalWindow } from '@ng-bootstrap/ng-bootstrap/modal/modal-window';
@Injectable({
  providedIn: 'root'
})

export class AnalyticsService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
    // environment.apiUrl = 'http://localhost:8080';
  }



  getMonthlyIncome() {
    return this.middlewareService.select('getHomeIncomeMonthly', '', '', '\'id asc\'');
  }

  getHomeIncomeDaily() {
    return this.middlewareService.select('getHomeIncomeDaily', '', '', '\'id asc\'');
  }

  getHomeOutcomeMonthly() {
    return this.middlewareService.select('getHomeOutcomeMonthly', '', '', '\'id asc\'');
  }
  getHomeOutcomeDaily() {
    return this.middlewareService.select('getHomeOutcomeDaily', '', '', '\'id asc\'');
  }
  getMonthlyIncomeData() {
    return this.middlewareService.select('getMonthlyTotalIncome', '', '', '\'id asc\'');
  }
  getDepartmentSalesDaily() {
    return this.middlewareService.select('getDepartmentSalesNReturn', '', '', '');
  }
  getDepartmentSalesMonthly() {
    return this.middlewareService.select('getDepartmentSalesNReturnMonthly', '', '', '');
  }
  getTopSuppliers() {
    return this.middlewareService.select('getTopSuppliers', '', '', '');
  }
  getProductTotalRating() {
    return this.middlewareService.select('getTotalProductRating', '', '', '');
  }
  getTopProducts() {
    return this.middlewareService.select('getTopSellingProducts', '', '', '');
  }
  gettopSellingBrands() {
    return this.middlewareService.select('gettopSellingBrands', '', '', '');
  }
}
