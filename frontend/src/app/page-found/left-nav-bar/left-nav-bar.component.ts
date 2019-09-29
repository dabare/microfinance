import {AfterViewInit, Component, OnInit} from '@angular/core';
import {LeftNavBarService} from './left-nav-bar.service';
import {LoginService} from '../../login/login.service';

@Component({
  selector: 'app-left-nav-bar',
  templateUrl: './left-nav-bar.component.html',
  styleUrls: ['./left-nav-bar.component.scss']
})
export class LeftNavBarComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    this.clickLink('#dashboard');
  }

  constructor(private leftNavBarComponent: LeftNavBarService, private loginService: LoginService) {
  }

  ngOnInit() {
  }

  clickLink(el) {
    this.leftNavBarComponent.clickLink(el);
  }

  getUserTypeId() {
    return this.loginService.getUser().privilege_id;
  }
}
