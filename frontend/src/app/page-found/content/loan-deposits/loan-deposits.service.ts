import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.prod';
import {LoginService} from '../../../login/login.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoanDepositsService {

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
  }

  getAllMemberLoanDeposits() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMemberLoanDeposits', {});
  }

  insertMemberLoanDeposit(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMemberLoanDeposit', data);
  }

  updateMemberLoanDeposit(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/updateMemberLoanDeposit', data);
  }

  cancelMemberLoanDeposit(data: any) {
    return this.httpClient.post(environment.apiUrl + '/cancelMemberLoanDeposit', data);
  }

  getActiveMemberLoans() {
    return this.httpClient.post(environment.apiUrl + '/viewActiveMemberLoans', {});
  }
}
