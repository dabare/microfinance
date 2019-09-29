import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../../login/login.service';
import Swal from 'sweetalert2';
import {UserService} from './user.service';
import {NotificationsService} from '../../../utils/notifications';

@Component({
  selector: 'app-tables',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(private userService: UserService, public loginService: LoginService, private notifi: NotificationsService) {
  }

  name = this.loginService.getUser().name;
  password = this.loginService.getUser().pass;
  email = this.loginService.getUser().email;
  contactNo = this.loginService.getUser().contactNo;
  id = this.loginService.getUser().id;

  ngOnInit() {
  }

  loginAgail() {
    Swal.fire('User Details Updated', 'Please Login Again');
    this.loginService.logout();
  }

  clickSave() {
    this.userService.updateUserDetals(this.name, this.contactNo, this.email, this.id).subscribe((data: any) => {
        this.notifi.success('User Details Updated');
        this.loginAgail();
      }, (err) => {
        this.notifi.error('While Updating User Details');
      }
    );
  }

  changePasssword() {
    this.userService.updateUserPassword(this.password, this.id).subscribe((data: any) => {
        this.notifi.success('Password Updated');
        this.loginAgail();
      }, (err) => {
        this.notifi.error('While Updating Password');
      }
    );
  }

  clickChangePassword() {
    Swal.mixin({
      input: 'password',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
    }).queue([
      {
        title: 'Old Password',
        text: 'Type your old password'
      },
      {
        title: 'New Password',
        text: 'Type your new password'
      },
      {
        title: 'Confirm Password',
        text: 'Type your new password again'
      }
    ]).then((result) => {
      if (result.value) {
        if (result.value[0] === this.password) {
          if (result.value[1] === result.value[2]) {
            this.password = result.value[1];
            this.changePasssword();
          } else {
            this.notifi.notice('New password confirmation failed');
          }
        } else {
          this.notifi.notice('Old password incorrect');
        }
      }
    });
  }
}
