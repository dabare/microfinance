import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../utils/notifications';
import {LoginService} from '../login/login.service';

@Component({
  selector: 'app-page-found',
  templateUrl: './page-found.component.html',
  styleUrls: ['./page-found.component.scss']
})
export class PageFoundComponent implements OnInit , AfterViewInit {

  constructor(private notifi: NotificationsService, private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.refreshToken();
  }

  ngAfterViewInit(): void {
    this.notifi.success('Welcome ' + this.loginService.getUser().name);
  }

}
