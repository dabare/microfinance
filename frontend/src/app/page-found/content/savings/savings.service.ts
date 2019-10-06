import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.prod';
import {LoginService} from '../../../login/login.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SavingsService {

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
  }

  getAllMemberSavings() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMemberSavings', {});
  }

  insertMemberSaving(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMemberSaving', data);
  }

  cancelMemberSaving(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/cancelMemberSaving', data);
  }

  updateMemberSaving(data: any) {
    return this.httpClient.post(environment.apiUrl + '/updateMemberSaving', data);
  }

  insertMemberWithdraw(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMemberWithdraw', data);
  }

  cancelMemberWithdraw(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/cancelMemberWithdraw', data);
  }

  updateMemberWithdraw(data: any) {
    return this.httpClient.post(environment.apiUrl + '/updateMemberWithdraw', data);
  }

  getAllCustomers() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMembers', {});
  }
}
