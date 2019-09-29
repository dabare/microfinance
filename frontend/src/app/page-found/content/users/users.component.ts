import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import Swal from 'sweetalert2';
import {UsersService} from './users.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  defaultPassword = '12345678';

  userDataTableLength = 5;
  userDataTableSearch = '';
  userDataTable: any;

  showEdit = false;


  actionMode = '';

  users: any[] = [];
  user = {
    id: -1,
    name: '',
    contactNo: '-',
    username: '-',
    password: this.defaultPassword,
    user_type_id: -1,
    registered_date: '',
    userid: -1,
    status: -1,
    email: '-',
    type: '-',
    created_by: '-'
  };

  userTypes: any[] = [];

  constructor(private usersService: UsersService, private notifi: NotificationsService) {
  }


  ngOnInit() {
    this.clearUser();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllValidUsers();
    this.getAllUserTypes();
  }

  clickNewUser() {
    this.actionMode = 'new';
    this.clearUser();
    $('#new_user').modal({backdrop: 'static', keyboard: false});
  }

  clickRegisterUser() {
    if (this.user.name) {
      if (this.user.contactNo) {
        if (this.user.username) {
          if (this.user.user_type_id > -1) {
            this.usersService.insertUser(this.user).subscribe((data: any) => {
                this.getAllValidUsers();
                this.notifi.success('User inserted');
                $('#new_user').modal('hide');
                Swal.fire('Password is: ' + this.defaultPassword, 'Change the password after you login');
              }, (err) => {
                this.notifi.error('While inserting user');
              }
            );
          } else {
            this.notifi.notice('Please select a user type for the user');
          }
        } else {
          this.notifi.notice('Please provide a username for the user');
        }
      } else {
        this.notifi.notice('Please provide a phone number for the user');
      }
    } else {
      this.notifi.notice('Please provide a name for the user');
    }
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  clickEditUser(i) {
    this.actionMode = 'edit';
    this.clearUser();

    this.user.id = this.users[i].id;
    this.user.name = this.users[i].name;
    this.user.contactNo = this.users[i].contactNo;
    this.user.username = this.users[i].username;
    this.user.password = this.users[i].password;
    this.user.user_type_id = this.users[i].user_type_id;
    this.user.registered_date = this.users[i].registered_date;
    this.user.userid = this.users[i].userid;
    this.user.status = this.users[i].status;
    this.user.email = this.users[i].email;
    this.user.type = this.users[i].type;
    this.user.created_by = this.users[i].created_by;

    $('#new_user').modal({backdrop: 'static', keyboard: false});
  }

  clickUpdateUser() {
    if (this.user.name) {
      if (this.user.contactNo) {
        if (this.user.username) {
          if (this.user.type) {
            this.usersService.updateUser(this.user).subscribe((data: any) => {
                this.getAllValidUsers();
                this.notifi.success('User Updated');
                $('#new_user').modal('hide');
              }, (err) => {
                this.notifi.error('While Updating user');
              }
            );
          } else {
            this.notifi.notice('Please select a user type for the user');
          }
        } else {
          this.notifi.notice('Please provide a username for the user');
        }
      } else {
        this.notifi.notice('Please provide a phone number for the user');
      }
    } else {
      this.notifi.notice('Please provide a name for the user');
    }
  }

  clickDeleteUser(i) {
    if (this.users[i].id === '1') {
      this.notifi.info('Super admin cannot be deleted');
    } else {
      this.actionMode = 'delete';
      this.clearUser();
      const currentClass = this;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Delete ' + this.users[i].name,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Yes, delete!'
      }).then(
        (willDelete) => {
          if (willDelete.value) {
            currentClass.user.id = currentClass.users[i].id;
            currentClass.usersService.deleteUser(this.user).subscribe((data: any) => {
                currentClass.getAllValidUsers();
                currentClass.notifi.success('User Deleted');
              }, (err) => {
                currentClass.notifi.error('While Deleting user');
              }
            );
          }
        });
    }
  }

  clickResetPassword(i) {
    this.actionMode = 'resetPassword';
    this.clearUser();

    this.user.id = this.users[i].id;
    this.user.name = this.users[i].name;
    this.user.contactNo = this.users[i].contactNo;
    this.user.username = this.users[i].username;
    this.user.password = this.defaultPassword;
    this.user.user_type_id = this.users[i].user_type_id;
    this.user.registered_date = this.users[i].registered_date;
    this.user.userid = this.users[i].userid;
    this.user.status = this.users[i].status;
    this.user.email = this.users[i].email;
    this.user.type = this.users[i].type;
    this.user.created_by = this.users[i].created_by;


    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Reset Password Of ' + this.users[i].name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, reset!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.usersService.updateUser(currentClass.user).subscribe((data: any) => {
            currentClass.getAllValidUsers();
            currentClass.notifi.success('Password Reset');
            Swal.fire('Password is: ' + currentClass.defaultPassword, 'Change the password after you login');
            }, (err) => {
              this.notifi.error('While resetting password');
            }
          );
        }
      });


  }

  userTypeSelected(value) {
    this.user.user_type_id = value;
  }

  clearUser() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.user.id = -1;
    this.user.name = '';
    this.user.contactNo = '';
    this.user.username = '';
    this.user.password = this.defaultPassword;
    this.user.user_type_id = -1;
    this.user.registered_date = mm + '/' + dd + '/' + yyyy;
    this.user.userid = -1;
    this.user.status = 1;
    this.user.email = '';
    this.user.type = '';
    this.user.created_by = '';
  }

  getAllValidUsers() {
    this.users = [];
    this.usersService.getAllActiveUsers().subscribe((data: any) => {
        this.users = data;
        this.addIndex(this.users);
        this.drawTable();
      }, (err) => {
        this.notifi.error('While fetching user details');
        this.userDataTable.clear();
        this.userDataTable.draw();
      }
    );
  }

  getAllUserTypes() {
    this.userTypes = [];
    this.usersService.getAllUserTypes().subscribe((data: any) => {
        this.userTypes = data;
        this.addIndex(this.userTypes);
      }, (err) => {
        this.notifi.error('While fetching user type details');
      }
    );
  }

  refreshUsers() {
    this.userDataTableSearch = '';
    this.getAllValidUsers();
    this.searchData();
  }

  keyupPhone() {
    this.user.contactNo = $('#userPhone').val();
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.userDataTable) {
      this.userDataTable = $('#usersDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.userDataTableLength,
        responsive: false,
        sDom: 'tipr',
        searching: true,
        ordering: true,
        retrieve: true,
        fixedColumns: {
          heightMatch: 'none'
        },
        fnDrawCallback: (osSettings) => {
          this.resetTableListners();
        },
        columnDefs: [
          {
            searchable: false,
            sortable: false,
            targets: [0, 9]
          },
          {
            visible: false,
            targets: [0]
          }],
        order: [[0, 'asc']],
      });
    }
  }

  resetTableListners() {
    // store current class reference in _currClassRef variable for using in jquery click event handler
    const currClassRef = this;

    // unbind previous event on tbody so that multiple events are not binded to the table whenever this function runs again
    $('#usersDataTable tbody td').unbind();

    // defined jquery click event
    $('#usersDataTable tbody td').on('click', 'button', function() {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.userDataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('editUser')) {
        currClassRef.clickEditUser(row.data()[0]);
      } else if ($(this).hasClass('deleteUser')) {
        currClassRef.clickDeleteUser(row.data()[0]);
      } else if ($(this).hasClass('resetPassword')) {
        currClassRef.clickResetPassword(row.data()[0]);
      }
    });
  }

  searchData() {
    this.userDataTable.search(this.userDataTableSearch).draw();
  }

  setDatatableLength() {
    this.userDataTable.page.len(this.userDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.customerDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.userDataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

// Draw once all updates are done
//     this.dataTable.rows().clear().draw();
    for (const user of this.users) {
      let action =
        '<button class="btn btn-mini btn-warning editUser" title="Edit user details"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini resetPassword" style="background-color: #b524ff" title="Reset password"> <i class="fa fa-key" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteUser" title="Delete user"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      if (user.id === '1') {
        action = '';
      }

      this.userDataTable.row.add([user.index, user.id, user.name, user.type, user.username, user.contactNo,
        user.email, user.created_by, user.registered_date, action]);
    }
    this.userDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}
