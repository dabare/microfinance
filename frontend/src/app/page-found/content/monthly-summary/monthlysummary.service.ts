import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
@Injectable({
  providedIn: 'root'
})

export class MonthlySummaryService {

  constructor(private httpClient: HttpClient,private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  }

  getHomeIncomeDaily() {
    return this.middlewareService.select('getHomeIncomeMonthly', '', '', '');
  }
  getPaymentTypeSales() {
    return this.middlewareService.select('getPaymentTypeSalesMonthly', '', '', '');
  }
  getDepartmentSalesDaily(){ 
     return this.middlewareService.select('getDepatmentSalesMonthly', '', '', ''); 
  }
  getDailyReturnTotal(){
    return this.middlewareService.select('getMonthlyReturnTotal', '', '', ''); 
  }

  
  printReport(printObject:any){
    return this.httpClient.post(environment.printingApiUrl + '/util/print',printObject);
  } 
}
