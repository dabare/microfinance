import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService) {
  }

  username = '';
  password = '';

  ngOnInit() {
  }

  clickLogin() {
    this.loginService.login(this.username, this.password);
  }
}
