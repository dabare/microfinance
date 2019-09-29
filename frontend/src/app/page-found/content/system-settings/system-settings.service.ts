import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
import {LoginService} from '../../../login/login.service';

@Injectable({
  providedIn: 'root'
})

export class SystemSettingsService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  getCusPoints() {
    return this.middlewareService.select('getCusPoints', '', '', '');
  }

  getSupPoints() {
    return this.middlewareService.select('getSupPoints', '', '', '');
  }

  getProdPoints() {
    return this.middlewareService.select('getProdPoints', '', '', '');
  }

}
