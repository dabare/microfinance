import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../login/login.service';
import Swal from 'sweetalert2';
import {NotificationsService} from '../../../utils/notifications';
import {SystemSettingsService} from './system-settings.service';

@Component({
  selector: 'app-tables',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {

  constructor(private userService: SystemSettingsService, private loginService: LoginService, private notifi: NotificationsService) {
  }

  name = this.loginService.getUser().name;
  password = this.loginService.getUser().password;
  email = this.loginService.getUser().email;
  contactNo = this.loginService.getUser().contactNo;
  id = this.loginService.getUser().id;

  ngOnInit() {
  }


}
