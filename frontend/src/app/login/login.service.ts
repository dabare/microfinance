import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../middleware.service';
import {Router} from '@angular/router';
import {SalesReturnService} from '../page-found/content/sales-return/sales-return.service';
import {NotificationsService} from '../utils/notifications';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private router: Router, private httpClient: HttpClient, private middlewareService: MiddlewareService,
              private notifi: NotificationsService) {
    if (!this.isValidUser()) {
      this.logout();
    }
  }

  private defaultRutes = {
    13: 'app/dashboard',
    1: 'app/invoice',
    2: 'app/grn-list',
    3: 'app/dashboard',
  };

  public login(username, password) {
    this.loginEndpoint(username, password).subscribe((data: any) => {
        if (data.user.length > 0 && data.user[0].uname === username && data.user[0].pass === password) {
          localStorage.setItem('oidfjntid', JSON.stringify(data));
          this.notifi.info('Login success');
          this.routeToDefault();
        }
      }, (err) => {
        if (err.toString() !== 'Unknown Error') {
          this.notifi.info('Invalid Credentials');
        }
      }
    );
  }

  private autoLogin() {
    this.loginEndpoint(this.getUser().uname, this.getUser().pass).subscribe((data: any) => {
        if (data.user.length > 0 && data.user[0].uname === this.getUser().uname && data.user[0].pass === this.getUser().pass) {
          localStorage.setItem('oidfjntid', JSON.stringify(data));
          this.notifi.info('Session Refreshed');
          this.routeToDefault();
        }
      }, (err) => {
        if (err.toString() !== 'Unknown Error') {
          this.notifi.info('Autologin Failed');
        }
      }
    );
  }

  public logout() {
    localStorage.removeItem('oidfjntid');
    this.router.navigate(['login']);
  }

  public sessionTimeOutRedirectToLogin() {
    this.notifi.info('Your session has expired. Please login again.');
    localStorage.removeItem('oidfjntid');
    // this.router.navigate(['login']);
  }

  public tokenExpiredRedirectToLogin() {
    this.notifi.info('Your token has expired. Please login again.');
    localStorage.removeItem('oidfjntid');
    // this.router.navigate(['login']);
  }

  public isValidUser() {
    return this.isTokenValid();
  }

  public getUser() {
    if (this.isTokenValid()) {
      return JSON.parse(localStorage.getItem('oidfjntid')).user[0];
    } else {
      this.router.navigate(['login']);
      return null;
    }
  }

  public getToken() {
    if (this.isTokenValid()) {
      return JSON.parse(localStorage.getItem('oidfjntid')).token;
    } else {
      return '--';
    }
  }

  public refreshToken() {
    if (this.isTokenValid() && (this.getTokenValidTime() < 60 * 10)) {
      this.notifi.info('Your session is about to expire. Trying to revalidate...');
      this.autoLogin();
    } else if (!this.isTokenValid()) {
      // this.tokenExpiredRedirectToLogin();
    }
  }

  public routeToDefault() {
    document.location.href = location.origin + '/' + this.defaultRutes[this.getUser().privilege_id];
  }

  private loginEndpoint(uname, pass) {
    return this.httpClient.post(environment.apiUrl + '/login', {username: uname, password: pass});
  }

  private hasToken() {
    return JSON.parse(localStorage.getItem('oidfjntid')) != null;
  }

  private getExpirationTime() {
    if (this.hasToken()) {
      return JSON.parse(localStorage.getItem('oidfjntid')).expirationTime;
    } else {
      return null;
    }
  }

  private getTokenValidTime() {
    if (this.hasToken()) {
      return this.getExpirationTime() - Date.now() / 1000;
    } else {
      return -1;
    }
  }

  private isTokenValid() {
    return this.getTokenValidTime() > 0;
  }
}
