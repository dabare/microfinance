import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import Swal from 'sweetalert2';
import {LoansService} from './loans.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './loans.component.html',
  styleUrls: ['./loans.component.scss']
})
export class LoansComponent implements OnInit, AfterViewInit {

  loansDataTableLength = 5;
  loansDataTableSearch = '';
  loansDataTable: any;

  showEdit = false;


  actionMode = '';

  loans: any[] = [];

  loan = {
    id: -1,
    code: '-',
    member_id: '',
    member_loan_plan_id: '-1',
    rate: '1',
    amount: 0,
    charges: 0,
    duration_months: 0,
    grace_period_days: 0,
    late_payment_charge: 0,
    reject_cheque_penalty: 0,
    status: '1',
    note: '',
    req_date: '',
    req_user: '-1',
    updated_by: ''
  };

  constructor(private loansService: LoansService, private notifi: NotificationsService) {
  }


  ngOnInit() {
    this.clearLoan();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllLoans();
  }

  clickNewLoan() {
    this.actionMode = 'new';
    this.clearLoan();
    $('#new_Loan').modal({backdrop: 'static', keyboard: false});
  }

  clickRegisterLoan() {
    // if (this.customer.name) {
    //   if (this.customer.tel) {
    //     this.customerService.insertCustomer(this.customer).subscribe((data: any) => {
    //         this.getAllCustomers();
    //         this.notifi.success('Member inserted');
    //         $('#new_Customer').modal('hide');
    //       }, (err) => {
    //         this.notifi.error('While inserting member');
    //       }
    //     );
    //   } else {
    //     this.notifi.notice('Please provide a phone number for the member');
    //   }
    // } else {
    //   this.notifi.notice('Please provide a name for the member');
    // }
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

  getLoanCode(id) {
    while (id.length < 4) {
      id = '0' + id;
    }
    return 'LOAN' + id;
  }

  cents2rupees(cents) {
    const rupees = Math.floor(cents / 100);
    cents = cents % 100 + '';
    while (cents.length < 2) {
      cents = '0' + cents;
    }
    return rupees + '.' + cents;
  }

  clickEditLoan(i) {
    this.actionMode = 'edit';
    this.clearLoan();

    this.loan.id = this.loans[i].id;
    this.loan.code = this.loans[i].code;
    this.loan.member_id = this.loans[i].member_id;
    this.loan.member_loan_plan_id = this.loans[i].member_loan_plan_id;
    this.loan.rate = this.loans[i].rate;
    this.loan.amount = this.loans[i].amount;
    this.loan.charges = this.loans[i].charges;
    this.loan.duration_months = this.loans[i].duration_months;
    this.loan.grace_period_days = this.loans[i].grace_period_days;
    this.loan.late_payment_charge = this.loans[i].late_payment_charge;
    this.loan.reject_cheque_penalty = this.loans[i].reject_cheque_penalty;
    this.loan.status = this.loans[i].status;
    this.loan.note = this.loans[i].note;
    this.loan.req_date = this.loans[i].req_date;
    this.loan.req_user = this.loans[i].req_user;
    this.loan.updated_by = this.loans[i].updated_by;

    $('#new_Loan').modal({backdrop: 'static', keyboard: false});
  }

  clickUpdateLoan() {
    // if (this.customer.name) {
    //   if (this.customer.tel) {
    //     this.customerService.updateCustomer(this.customer).subscribe((data: any) => {
    //         this.getAllCustomers();
    //         this.notifi.success('Member Updated');
    //         $('#new_Customer').modal('hide');
    //       }, (err) => {
    //         this.notifi.error('While Updating Member');
    //       }
    //     );
    //   } else {
    //     this.notifi.notice('Please provide a phone number for the Member');
    //   }
    // } else {
    //   this.notifi.notice('Please provide a name for the Member');
    // }
  }

  clickDeleteLoan(i) {
    this.actionMode = 'delete';
    this.clearLoan();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + this.getLoanCode(this.loans[i].id),
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.loan.id = currentClass.loans[i].id;
          currentClass.loansService.deleteMemberLoan(this.loan).subscribe((data: any) => {
              currentClass.getAllLoans();
              currentClass.notifi.success('Loan Deleted');
            }, (err) => {
              currentClass.notifi.error('While Deleting Loan');
            }
          );
        }
      });
  }

  clearLoan() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();


    this.loan.id = -1;
    this.loan.code = '-';
    this.loan.member_id = '';
    this.loan.member_loan_plan_id = '';
    this.loan.rate = '1';
    this.loan.amount = 0;
    this.loan.charges = 0;
    this.loan.duration_months = 0;
    this.loan.grace_period_days = 0;
    this.loan.late_payment_charge = 0;
    this.loan.reject_cheque_penalty = 0;
    this.loan.status = '1';
    this.loan.note = '-';
    this.loan.req_date = '';
    this.loan.req_user = '-1';
    this.loan.updated_by = '';
  }

  getAllLoans() {
    this.loans = [];
    this.loansService.getAllMemberLoans().subscribe((data: any) => {
        this.loans = data;
        this.addIndex(this.loans);
        this.drawTable();
      }, (err) => {
        this.notifi.error('While fetching Member details');
        this.loansDataTable.clear();
        this.loansDataTable.draw();
      }
    );
  }

  refreshLoans() {
    this.loansDataTableSearch = '';
    this.getAllLoans();
    this.searchData();
  }


  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.loansDataTable) {
      this.loansDataTable = $('#loansDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.loansDataTableLength,
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
              $(win.document.body).find('h1').text('Loans');
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
    $('#loansDataTable tbody td').unbind();

    // defined jquery click event
    $('#loansDataTable tbody td').on('click', 'button', function() {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.loansDataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('editLoan')) {
        // use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);
        currClassRef.clickEditLoan(row.data()[0]);
      } else if ($(this).hasClass('deleteLoan')) {
        currClassRef.clickDeleteLoan(row.data()[0]);
      } else if ($(this).hasClass('showUpdateModal')) {

      }

    });
  }

  searchData() {
    this.loansDataTable.search(this.loansDataTableSearch).draw();
  }

  setDatatableLength() {
    this.loansDataTable.page.len(this.loansDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.customerDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.loansDataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

// Draw once all updates are done
//     this.dataTable.rows().clear().draw();
    for (const loan of this.loans) {
      const action =
        '<button class="btn btn-mini btn-warning editLoan" > <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteLoan"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      this.loansDataTable.row.add([loan.index, this.getLoanCode(loan.id), this.getCustomerCode(loan.member_id),
        loan.req_date, loan.rate + '%', this.cents2rupees(loan.amount), loan.duration_months, loan.note,
        loan.updated_by, loan.status, action]);

    }
    this.loansDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}
