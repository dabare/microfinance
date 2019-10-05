import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment.prod';
import {LoginService} from '../../../login/login.service';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class SavingRateService {

  constructor(private httpClient: HttpClient, private loginService: LoginService) {
  }

  getAllMemberSavingRates() {
    return this.httpClient.post(environment.apiUrl + '/viewAllMemberSavingRates', {});
  }

  insertMemberSavingRate(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/insertMemberSavingRate', data);
  }

  updateMemberSavingRate(data: any) {
    data.req_user = this.loginService.getUser().id;
    return this.httpClient.post(environment.apiUrl + '/updateMemberSavingRate', data);
  }

  cancelMemberSavingRate(data: any) {
    return this.httpClient.post(environment.apiUrl + '/cancelMemberSavingRate', data);
  }
}
