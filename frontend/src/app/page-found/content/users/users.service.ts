import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';
import {LoginService} from '../../../login/login.service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService, private loginService: LoginService) {
      }

  getAllActiveUsers() {
    return this.middlewareService.select('viewAllActiveUsers', '', '', '', );
  }

  getAllUserTypes() {
    return this.middlewareService.select('user_type', '', '', '', );
  }

  insertUser(user: any) {
    return this.middlewareService.insert('user',
      'name, contactNo, username, password, user_type_id, email, userid',
      '(\'' + user.name + '\', \'' + user.contactNo + '\', \'' + user.username + '\', \'' +
      user.password + '\', \'' + user.user_type_id + '\', \'' + user.email + '\', \'' + this.loginService.getUser().id + '\' )',
    );
  }

  updateUser(user: any) {
    return this.middlewareService.update('user',
      'name=\'' + user.name + '\', contactNo=\'' + user.contactNo + '\', username=\'' + user.username +
      '\', password=\'' + user.password + '\', user_type_id=\'' + user.user_type_id + '\', email=\'' + user.email + '\'',
      'id=\'' + user.id + '\' ',
    );
  }

  deleteUser(user: any) {
    return this.middlewareService.update('user',
      'status=\'0\'',
      'id=\'' + user.id + '\' ',
    );
  }
}
