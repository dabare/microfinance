import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {LoginService} from './login/login.service';

@Injectable()
export class ResponseInterceptor implements ResponseInterceptor {
  constructor(private loginService: LoginService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loginService.refreshToken();
    request = request.clone({
        setHeaders: {
          Token: this.loginService.getToken()
        }
      });

    return next.handle(request);
  }
}
