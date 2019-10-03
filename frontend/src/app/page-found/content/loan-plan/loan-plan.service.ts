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

  getAllMemberLoanPlans() {
    return this.httpClient.post(environment.apiUrl + '/getAllMemberLoanPlans', {});
  }

  insertMemberLoanPlan(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMemberLoanPlan', data);
  }

  updateMemberLoanPlan(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/updateMemberLoanPlan', data);
  }

  deleteMemberLoanPlan(data: any) {
    return this.httpClient.post(environment.apiUrl + '/deleteMemberLoanPlan', data);
  }
}
