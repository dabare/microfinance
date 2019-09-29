import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {LoginService} from './login/login.service';
import {NotificationsService} from './utils/notifications';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private notifi: NotificationsService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.loginService.sessionTimeOutRedirectToLogin();
      } else if (err.status === 0) {
        this.notifi.error('Could not establish connection to the data server.');
        this.notifi.info('Check your internet connection');
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
