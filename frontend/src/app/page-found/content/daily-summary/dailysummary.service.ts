import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
@Injectable({
  providedIn: 'root'
})

export class DailySummaryService {

  constructor(private httpClient: HttpClient,private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  }

  getHomeIncomeDaily() {
    return this.middlewareService.select('getHomeIncomeDaily', '', '', '');
  }
  getPaymentTypeSales() {
    return this.middlewareService.select('getPaymentTypeSales', '', '', '');
  }
  getDepartmentSalesDaily(){ 
     return this.middlewareService.select('getDepartmentSalesDaily', '', '', ''); 
  }
  getDailyReturnTotal(){
    return this.middlewareService.select('getDailyReturnTotal', '', '', ''); 
  }
  printReport(printObject:any){
    return this.httpClient.post(environment.printingApiUrl + '/util/print',printObject);
  }

}
