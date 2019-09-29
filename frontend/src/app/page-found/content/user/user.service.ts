import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
import {LoginService} from '../../../login/login.service';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  updateUserDetals(name: string, contactNo: string, email: string, id: string) {
    return this.httpClient.post(environment.apiUrl + '/updateUserDetails', {name, contactNo, email, id});
  }

  updateUserPassword(pass: string, id: string) {
    return this.httpClient.post(environment.apiUrl + '/updateUserPassword', {pass, id});
  }

}
