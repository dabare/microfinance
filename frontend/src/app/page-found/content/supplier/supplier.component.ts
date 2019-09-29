import { Component, OnInit, ElementRef, HostListener, AfterViewInit, Directive, Input, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgControl } from '@angular/forms';
import { SupplierService } from './supplier.service';
import { NotificationsService } from 'src/app/utils/notifications';
import Swal from 'sweetalert2';
import { UserService } from '../user/user.service';
import { LoginService } from 'src/app/login/login.service';
declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
})
@Directive({
  selector: 'input[numbersOnly]'
})
export class SupplierComponent implements OnInit, AfterViewInit {

  dataTableLength = 5;
  dataTableSearch = '';
  dataTable: any;

  showEdit = false;
  errorField = false;
  showNew = 'yes';
  actionMode = '';
  suppliers: any[] = [];
  supplier = {
    id: -1,
    name: '',
    contactNo1: '',
    contactNo2: '',
    address: '',
    rating: '',
    email: '',
    registered_date: '',
    userid: -1
  };
  totalSupplierRating = 0;
  constructor(private loginService: LoginService,private supplierService: SupplierService, private notifi: NotificationsService, private _el: ElementRef) {
  }
 
  ngOnInit(): void {
    this.clearSupplier();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllSuppliers();
    this.validateFields();
  
  }

  validateFields() {
    $("#contactno1").on("keypress keyup blur", function (event) {
      $(this).val($(this).val().replace(/[^\d].+/, ""));

      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }
    });
    $("#contactno2").on("keypress keyup blur", function (event) {
      $(this).val($(this).val().replace(/[^\d].+/, ""));
      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }
    });

  }
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   switch (event.key) {
  //     case 'F2':
  //       alert("ssss")
  //       return; 
  //   }
  // }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }
  getAllSuppliers() {
    this.suppliers = [];
    this.supplierService.getAllSuppliers().subscribe((data: any) => {
      this.suppliers = data;
      this.addIndex(this.suppliers);
      this.drawTable();
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );

    this.supplierService.getSupplierTotalRating().subscribe((data: any) => {
      this.totalSupplierRating = data[0].totalRating;
    }, (err) => {
      this.notifi.error('While loading supplier');
    });
  }
 
  clickNewSupplier() {
    this.showNew = 'yes';
    this.actionMode = 'new';
    // $('#new_Customer').modal('show');
    this.clearSupplier();
    $('#new_supplier').modal({ backdrop: 'static', keyboard: false });
  }
  validateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  RegisterSupplier() { 
    this.supplier.id=this.loginService.getUser().id;
    if (this.supplier.name) {
      if (this.supplier.contactNo1 || this.supplier.contactNo2) {
        alert(this.supplier.id)
        if (this.supplier.email == '' || this.validateEmail(this.supplier.email)) { 
        this.supplierService.insertSupplier(this.supplier).subscribe((data: any) => {
          console.log(data);
          this.getAllSuppliers();

          this.notifi.success('Supplier registered');
          this.clearSupplier();
          $('#new_supplier').modal('hide');

        }, (err) => {
          this.notifi.error('While inserting supplier');
        }
        );
      }else{
        this.notifi.notice('Please provide a valid email address');
      }
      } else {
        this.notifi.notice('Please provide a phone number for the supplier');
      }
    } else {
      this.notifi.notice('Please provide a name for the supplier');
    }
  }

  removeSupplier(i) {
    this.actionMode = 'delete';
    this.clearSupplier();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + this.suppliers[i].name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.supplier.id = currentClass.suppliers[i].id;
          currentClass.supplierService.deleteSupplier(this.supplier).subscribe((data: any) => {
            currentClass.getAllSuppliers();
            currentClass.notifi.success('Supplier Deleted');
          }, (err) => {
            currentClass.notifi.error('While Deleting supplier');
          }
          );
        }
      });

  }
  clearSupplier() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.supplier.id = -1;
    this.supplier.name = '';
    this.supplier.contactNo1 = '';
    this.supplier.contactNo2 = '';
    this.supplier.address = '';
    this.supplier.email = '';
    this.supplier.rating = '0';
    this.supplier.registered_date = mm + '/' + dd + '/' + yyyy;
    this.supplier.userid =   this.loginService.getUser().id;

  }

  viewEachSupplier(i) {
    this.showNew = 'no';
    this.actionMode = 'edit';
    this.clearSupplier();

    this.supplier.id = this.suppliers[i].id;
    this.supplier.name = this.suppliers[i].name;
    this.supplier.contactNo1 = this.suppliers[i].contactNo1;
    this.supplier.contactNo2 = this.suppliers[i].contactNo2;
    this.supplier.address = this.suppliers[i].address;
    this.supplier.email = this.suppliers[i].email;
    this.supplier.rating = this.suppliers[i].rating;
    this.supplier.registered_date = this.suppliers[i].registered_date.replace(/-/g, '/');
    this.supplier.userid = this.suppliers[i].userid;

    $('#new_supplier').modal({ backdrop: 'static', keyboard: false });
  }


  updateSupplier() {
    if (this.supplier.name) {
      if (this.supplier.contactNo1 || this.supplier.contactNo2) {
        this.supplierService.updateSupplier(this.supplier).subscribe((data: any) => {
          this.getAllSuppliers();
          this.notifi.success('Supplier Updated');
          this.clearSupplier();

          $('#new_supplier').modal('hide');
        }, (err) => {
          this.notifi.error('While Updating supplier');
        }
        );
      } else {
        this.notifi.notice('Please provide a phone number for the supplier');
      }
    } else {
      this.notifi.notice('Please provide a name for the supplier');
    }
  }
  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.dataTable) {
      this.dataTable = $('#mytable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.dataTableLength,
        responsive: false,
        sDom: 'Btipr',
        searching: true,
        ordering: true,
        retrieve: true,
        fixedColumns: {
          heightMatch: 'none'
        },
        buttons: [
          {
            extend: 'print',
            text: 'Print current page',
            exportOptions: {
              modifier: {
                page: 'current'
              }
            },
            customize(win) {
              $(win.document.body).find('h1').css('text-align', 'center');
              $(win.document.body).find('h1').text('Suppliers');
            }
          },
          'copy', 'csv', 'excel', 'pdf'
        ],
        fnDrawCallback: (osSettings) => {
          this.resetTableListners();
        },
        columnDefs: [
          {
            searchable: false,
            sortable: false,
            targets: [0, 8]
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
    $('#mytable tbody td').unbind();

    // defined jquery click event
    $('#mytable tbody td').on('click', 'button', function () {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.dataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('editSupplier')) {
        // use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);

        currClassRef.viewEachSupplier(row.data()[0]);
      } else if ($(this).hasClass('deleteSupplier')) {
        currClassRef.removeSupplier(row.data()[0]);
      } else if ($(this).hasClass('showUpdateModal')) {

      }

    });
  }

  searchData() {
    this.dataTable.search(this.dataTableSearch).draw();
  }

  setDatatableLength() {
    this.dataTable.page.len(this.dataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.dataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.dataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

    // Draw once all updates are done
    //     this.dataTable.rows().clear().draw();



    for (const sup of this.suppliers) {
      const phone = [];
      if (sup.contactNo1.trim() && sup.contactNo1.trim() !== '-') {
        phone.push(sup.contactNo1.trim());
      }
      if (sup.contactNo2.trim() && sup.contactNo2.trim() !== '-') {
        phone.push(sup.contactNo2.trim());
      }
      let action =
        '<button class="btn btn-mini btn-warning editSupplier"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteSupplier"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';



      let suprating = ((Number(sup.rating) / Number(this.totalSupplierRating)) * 100).toFixed(2);

      this.dataTable.row.add([sup.index, sup.id, sup.name, phone.join(',') || '-', sup.address,
      sup.email, suprating, sup.registered_date, action]);
    }
    this.dataTable.draw();
    this.resetTableListners();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}

