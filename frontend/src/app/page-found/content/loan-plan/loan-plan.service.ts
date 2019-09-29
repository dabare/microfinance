import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.prod';
import {LoginService} from '../../../login/login.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoanPlanService {

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
  }

  getAllCustomers() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMembers', {});
  }

  insertCustomer(customer: any) {
    customer.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMember', customer);
  }

  updateCustomer(customer: any) {
    customer.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/updateMember', customer);
  }

  deleteCustomer(customer: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteMember', customer);
  }
}
