import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  getAllCustomers() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMembers', {});
  }

  insertCustomer(customer: any) {
    return this.httpClient.post(environment.apiUrl + '/insertMember', customer);
  }

  updateCustomer(customer: any) {
    return this.httpClient.post(environment.apiUrl + '/updateMember', customer);
  }

  deleteCustomer(customer: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteMember', customer);
  }
}
