import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {LoginService} from './login/login.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('ErrorInterceptor');
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        this.loginService.sessionTimeOutRedirectToLogin();
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
