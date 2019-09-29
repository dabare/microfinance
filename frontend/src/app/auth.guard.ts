import {Injectable} from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import {Observable} from 'rxjs';
import {LoginService} from './login/login.service';
import {NotificationsService} from './utils/notifications';
import {LeftNavBarService} from './page-found/left-nav-bar/left-nav-bar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService, private notificationsService: NotificationsService) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // if (this.loginService.isValidUser()) {
    //     //   if (!next.data.roles.includes(this.loginService.getUser().user_type_id + '')) {
    //     //     this.loginService.routeToDefault();
    //     //     this.notificationsService.notice('Sorry.. \nYou dont have access to view this content.');
    //     //     return false;
    //     //   }
    //     //   return true;
    //     // }
    //     // this.router.navigate(['login']);
    //     // return false;

    return true;
  }
}
