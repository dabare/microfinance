import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CustomerService} from './customer.service';
import {NotificationsService} from '../../../utils/notifications';
import Swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit, AfterViewInit {

  customerDataTableLength = 5;
  customerDataTableSearch = '';
  customerDataTable: any;

  showEdit = false;


  actionMode = '';

  customers: any[] = [];

  customer = {
    id: -1,
    code: '-',
    name: '-',
    nic: '-',
    dob: '-',
    tel: '-',
    address: '-',
    email: '-',
    representative: '-1',
    bondsman: '-',
    bondsman_nic: '-',
    status: 0,
    req_date: '-',
    req_user: '-1'
  };

  savingHistory: any[] = [];

  constructor(private route: ActivatedRoute, private customerService: CustomerService, private notifi: NotificationsService) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.code) {
        this.customerDataTableSearch = params.code;
      }
    });
    this.clearCustomer();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllCustomers();
  }

  clickNewCustomer() {
    this.actionMode = 'new';
    this.clearCustomer();
    $('#new_Customer').modal({backdrop: 'static', keyboard: false});
  }

  clickRegisterCustomer() {
    if (this.customer.name) {
      if (this.customer.tel) {
        this.customerService.insertCustomer(this.customer).subscribe((data: any) => {
            this.getAllCustomers();
            this.notifi.success('Member inserted');
            $('#new_Customer').modal('hide');
          }, (err) => {
            this.notifi.error('While inserting member');
          }
        );
      } else {
        this.notifi.notice('Please provide a phone number for the member');
      }
    } else {
      this.notifi.notice('Please provide a name for the member');
    }
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  getCustomerCode(id) {
    while (id.length < 3) {
      id = '0' + id;
    }
    return 'MEM' + id;
  }

  loadCustomer(i) {
    this.clearCustomer();
    this.customer.id = this.customers[i].id;
    this.customer.code = this.customers[i].code;
    this.customer.name = this.customers[i].name;
    this.customer.nic = this.customers[i].nic;
    // this.customer.dob = this.customers[i].dob.split('-')[2] + '-' + this.customers[i].dob.split('-')[0] + '-' +
    //   this.customers[i].dob.split('-')[1]; // yyyy-mm-dd
    this.customer.dob = this.customers[i].dob;
    this.customer.tel = this.customers[i].tel;
    this.customer.address = this.customers[i].address;
    this.customer.email = this.customers[i].email;
    this.customer.representative = this.customers[i].representative;
    this.customer.bondsman = this.customers[i].bondsman;
    this.customer.bondsman_nic = this.customers[i].bondsman_nic;
    this.customer.status = this.customers[i].status;
    this.customer.req_date = this.customers[i].req_date;
    // this.customer.req_date = this.customers[i].req_date.replace(/-/g, '/');
    this.customer.req_user = this.customers[i].req_user;
  }

  clickEditCustomer(i) {
    this.actionMode = 'edit';
    this.loadCustomer(i);

    $('#new_Customer').modal({backdrop: 'static', keyboard: false});
  }

  clickUpdateCustomer() {
    if (this.customer.name) {
      if (this.customer.tel) {
        this.customerService.updateCustomer(this.customer).subscribe((data: any) => {
            this.getAllCustomers();
            this.notifi.success('Member Updated');
            $('#new_Customer').modal('hide');
          }, (err) => {
            this.notifi.error('While Updating Member');
          }
        );
      } else {
        this.notifi.notice('Please provide a phone number for the Member');
      }
    } else {
      this.notifi.notice('Please provide a name for the Member');
    }
  }

  clickDeleteCustomer(i) {
    this.actionMode = 'delete';
    this.clearCustomer();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + this.customers[i].name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.customer.id = currentClass.customers[i].id;
          currentClass.customerService.deleteCustomer(this.customer).subscribe((data: any) => {
              currentClass.getAllCustomers();
              currentClass.notifi.success('Member Deleted');
            }, (err) => {
              currentClass.notifi.error('While Deleting Member');
            }
          );
        }
      });
  }

  clickInfoCustomer(i) {
    this.actionMode = 'info';
    this.loadCustomer(i);
    this.savingHistory = [];
    this.customerService.getCustomerSavingHistory(this.customer).subscribe((data: any) => {
        this.savingHistory = data;
        this.processSavingHistory();
        console.log(this.savingHistory);
      }, (err) => {
        this.notifi.error('While fetching Member History');
      }
    );
  }

  cents2rupees(cents) {
    cents = Math.ceil(cents);
    let sign = '';
    if (cents < 0) {
      sign = '-';
      cents *= -1;
    }
    const rupees = Math.floor(cents / 100);
    cents = cents % 100 + '';
    while (cents.length < 2) {
      cents = '0' + cents;
    }
    return sign + rupees + '.' + cents;
  }

  processSavingHistory() {
    const d = new Date();
    let dd = d.getFullYear() + '-' + (d.getMonth() + 1) ;
    if ( d.getDate() < 10) {
      dd += '-0' + d.getDate();
    } else {
      dd += '-' + d.getDate();
    }
    let firstRate = 0;
    let currentRateIndex = 0;
    this.savingHistory.push(
      {
        trx_type: 'BALANCE',
        req_date: dd
      }
    );
    for (let i = 0; i < this.savingHistory.length; i++) {
      if (firstRate === 0 && i < this.savingHistory.length - 1 && this.savingHistory[i + 1].trx_type !== 'RATE') {
        firstRate = i;
      }

      if (firstRate === 0 && i < this.savingHistory.length - 1 &&
        this.savingHistory[i].trx_type === 'RATE' && this.savingHistory[i + 1].trx_type === 'RATE') {
        firstRate = i + 1;
      }

      if (this.savingHistory[i].trx_type === 'RATE') {
        this.savingHistory[i].description = 'Rate Change ' + this.savingHistory[i].description;
        this.savingHistory[i].amount = 0;
        currentRateIndex = i;
      } else if (this.savingHistory[i].trx_type === 'DEPOSIT') {
        this.savingHistory[i].description = 'Deposit ' + this.savingHistory[i].description;
        this.savingHistory[i].amount = Number(this.savingHistory[i].value);
      } else if (this.savingHistory[i].trx_type === 'WITHDRAWAL') {
        this.savingHistory[i].description = 'Withdrawal ' + this.savingHistory[i].description;
        this.savingHistory[i].amount = -1 * Number(this.savingHistory[i].value);
      } else if (this.savingHistory[i].trx_type === 'BALANCE') {
        this.savingHistory[i].description = 'Balance Upto Now';
        this.savingHistory[i].amount = 0;
      }

      const newDate = new Date(this.savingHistory[i].req_date.split('-')[0],
        this.savingHistory[i].req_date.split('-')[1], this.savingHistory[i].req_date.split('-')[2]);
      let oldDate = newDate;

      if (i > firstRate) {
        oldDate = new Date(this.savingHistory[i - 1].req_date.split('-')[0],
          this.savingHistory[i - 1].req_date.split('-')[1], this.savingHistory[i - 1].req_date.split('-')[2]);
      }

      this.savingHistory[i].rate = Number(this.savingHistory[currentRateIndex].value);

      if (i === firstRate) {
        this.savingHistory[i].interest = 0;
        this.savingHistory[i].balance = 0;
        this.savingHistory[i].total = 0;
        this.savingHistory[i].days_passed = 0;
      } else if (i > firstRate) {
        this.savingHistory[i].days_passed = Math.ceil((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
        this.savingHistory[i].interest = (this.savingHistory[i - 1].total * this.savingHistory[i].days_passed
          * this.savingHistory[i - 1].rate) / 365;
        this.savingHistory[i].balance = this.savingHistory[i - 1].total + this.savingHistory[i].interest;
        this.savingHistory[i].total = this.savingHistory[i].balance + this.savingHistory[i].amount;
      }

    }
    this.savingHistory = this.savingHistory.slice(firstRate, this.savingHistory.length);
  }

  clearCustomer() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();


    this.customer.id = -1;
    this.customer.code = '';
    this.customer.name = '';
    this.customer.nic = '';
    this.customer.dob = '2012-12-12';
    this.customer.tel = '';
    this.customer.address = '';
    this.customer.email = '';
    this.customer.representative = '-1';
    this.customer.bondsman = '';
    this.customer.bondsman_nic = '';
    this.customer.status = 0;
    this.customer.req_date = mm + '/' + dd + '/' + yyyy;
    this.customer.req_user = '';
  }

  getAllCustomers() {
    this.customers = [];
    this.customerService.getAllCustomers().subscribe((data: any) => {
        this.customers = data;
        this.addIndex(this.customers);
        this.drawTable();
      }, (err) => {
        this.notifi.error('While fetching Member details');
        this.customerDataTable.clear();
        this.customerDataTable.draw();
      }
    );
  }

  refreshCustomers() {
    this.customerDataTableSearch = '';
    this.getAllCustomers();
    this.searchData();
  }

  internalCustomerClicked() {
    this.customer.representative = '-1';
  }

  externalCustomerClicked() {
    this.customer.representative = this.customers[0].id + '';
  }

  findCustomerById(id) {
    return this.customers.find((x) => x.id === (id + ''));
  }

  getInternalCustomers() {
    return this.customers.filter((x) => x.representative === '-1' && (x.id !== this.customer.id + ''));
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.customerDataTable) {
      this.customerDataTable = $('#customersDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.customerDataTableLength,
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
              // $(win.document.body).find('table').addClass('display').css('font-size', '9px');
              // $(win.document.body).find('tr:nth-child(odd) td').each(function(index){
              //   $(this).css('background-color','#D0D0D0');
              // });
              $(win.document.body).find('h1').css('text-align', 'center');
              $(win.document.body).find('h1').text('Members');
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
            searchable: false,
            sortable: true,
            targets: [6]
          },
          {
            visible: false,
            targets: [0]
          }],
        order: [[0, 'asc']],
      });
      this.searchData();
    }
  }

  resetTableListners() {
    // store current class reference in _currClassRef variable for using in jquery click event handler
    const currClassRef = this;

    // unbind previous event on tbody so that multiple events are not binded to the table whenever this function runs again
    $('#customersDataTable tbody td').unbind();

    // defined jquery click event
    $('#customersDataTable tbody td').on('click', 'button', function() {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.customerDataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('editCustomer')) {
        currClassRef.clickEditCustomer(row.data()[0]);
      } else if ($(this).hasClass('deleteCustomer')) {
        currClassRef.clickDeleteCustomer(row.data()[0]);
      } else if ($(this).hasClass('infoCustomer')) {
        currClassRef.clickInfoCustomer(row.data()[0]);
      }

    });
  }

  searchData() {
    this.customerDataTable.search(this.customerDataTableSearch).draw();
  }

  setDatatableLength() {
    this.customerDataTable.page.len(this.customerDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.customerDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.customerDataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

// Draw once all updates are done
//     this.dataTable.rows().clear().draw();
    for (const cus of this.customers) {
      const action =
        '<button class="btn btn-mini btn-info infoCustomer" > <i class="icofont icofont-info" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-warning editCustomer" > <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteCustomer"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      let rep = 'FEC Member';
      if (cus.representative !== '-1') {
        rep = this.findCustomerById(cus.representative) ? this.getCustomerCode(this.findCustomerById(cus.representative).id) :
          'DELETED USER';
      }
      this.customerDataTable.row.add([cus.index, this.getCustomerCode(cus.id), cus.name, cus.nic,
        cus.tel, cus.email, rep, cus.req_date, cus.updated_by, action]);

    }
    this.customerDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}
