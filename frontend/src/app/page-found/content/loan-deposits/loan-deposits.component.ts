import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import Swal from 'sweetalert2';
import {LoanDepositsService} from './loan-deposits.service';
import {ActivatedRoute} from '@angular/router';
import {FinanceService} from '../utils/finance.service';
import {LeftNavBarService} from '../../left-nav-bar/left-nav-bar.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './loan-deposits.component.html',
  styleUrls: ['./loan-deposits.component.scss']
})
export class LoanDepositsComponent implements OnInit, AfterViewInit {

  loanDepositStatus = {
    0: 'Deleted',
    1: 'Deposited',
    4: 'Cancelled'
  };

  loanDepositsDataTableLength = 5;
  loanDepositsDataTableSearch = '';
  loanDepositsDataTable: any;

  actionMode = '';

  loanDeposits: any[] = [];

  loanDeposit = {
    id: -1,
    member_loan_id: '',
    amount: '0.0',
    status: '1',
    note: '',
    req_date: '',
    user_set_req_date: null,
    req_user: '-1'
  };

  loans: any[] = [];

  constructor(private route: ActivatedRoute, public financeService: FinanceService,
              private loanDepositsService: LoanDepositsService, private notifi: NotificationsService,
              private leftNavBarService: LeftNavBarService) {
  }


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params.code) {
        this.loanDepositsDataTableSearch = params.code;
      }
    });
    this.clearLoanDeposit();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllLoanDeposits();
    this.getActiveMemberLoans();
  }

  clickNewLoanDeposit() {
    this.actionMode = 'new';
    this.clearLoanDeposit();
    $('#new_LoanDeposit').modal({backdrop: 'static', keyboard: false});
  }

  clickRegisterLoanDeposit() {
    this.loanDeposit.req_date = this.loanDeposit.user_set_req_date.year + '-' + this.loanDeposit.user_set_req_date.month + '-'
      + this.loanDeposit.user_set_req_date.day;
    this.loanDeposit.amount = (Number(this.loanDeposit.amount) * 100) + '';

    this.loanDepositsService.insertMemberLoanDeposit(this.loanDeposit).subscribe((data: any) => {
        this.getAllLoanDeposits();
        this.notifi.success('Deposit inserted');
        $('#new_LoanDeposit').modal('hide');
      }, (err) => {
        this.notifi.error('While inserting Deposit');
      }
    );
  }

  clickEditLoanDeposit(i) {
    this.actionMode = 'edit';
    this.clearLoanDeposit();

    this.loanDeposit.id = this.loanDeposits[i].id;
    this.loanDeposit.member_loan_id = this.loanDeposits[i].member_loan_id;
    this.loanDeposit.amount = this.financeService.cents2rupees(Number(this.loanDeposits[i].amount));
    this.loanDeposit.status = this.loanDeposits[i].status;
    this.loanDeposit.note = this.loanDeposits[i].note;
    this.loanDeposit.req_date = this.loanDeposits[i].req_date;
    this.loanDeposit.user_set_req_date.day = Number(this.loanDeposits[i].req_date.split('-')[2]);
    this.loanDeposit.user_set_req_date.month = Number(this.loanDeposits[i].req_date.split('-')[1]);
    this.loanDeposit.user_set_req_date.year = Number(this.loanDeposits[i].req_date.split('-')[0]);
    this.loanDeposit.req_user = this.loanDeposits[i].req_user;

    $('#new_LoanDeposit').modal({backdrop: 'static', keyboard: false});
  }

  clickUpdateLoanDeposit() {
    this.loanDeposit.req_date = this.loanDeposit.user_set_req_date.year + '-' + this.loanDeposit.user_set_req_date.month + '-'
      + this.loanDeposit.user_set_req_date.day;
    this.loanDeposit.amount = (Number(this.loanDeposit.amount) * 100) + '';

    this.loanDepositsService.updateMemberLoanDeposit(this.loanDeposit).subscribe((data: any) => {
        this.getAllLoanDeposits();
        this.notifi.success('Deposit Updated');
        $('#new_LoanDeposit').modal('hide');
      }, (err) => {
        this.notifi.error('While Updating Deposit');
      }
    );
  }

  gotoCustomer(i) {
    this.leftNavBarService.navigate('/app/customer',
      { queryParams: { code: this.financeService.getCustomerCode(this.loanDeposits[i].member_id) } });
  }

  gotoLoan(i) {
    this.leftNavBarService.navigate('/app/loans',
      { queryParams: { code: this.financeService.getLoanCode(this.loanDeposits[i].member_loan_id) } });
  }

  clickDeleteLoanDeposit(i) {
    this.actionMode = 'delete';
    this.clearLoanDeposit();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Cancel ' + this.financeService.getDepositCode(this.loanDeposits[i].id),
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.loanDeposit.id = currentClass.loanDeposits[i].id;
          currentClass.loanDepositsService.cancelMemberLoanDeposit(this.loanDeposit).subscribe((data: any) => {
              currentClass.getAllLoanDeposits();
              currentClass.notifi.success('Deposit Cancelled');
            }, (err) => {
              currentClass.notifi.error('While Cancelling Deposit');
            }
          );
        }
      });
  }

  clearLoanDeposit() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    this.loanDeposit.id = -1;
    this.loanDeposit.member_loan_id = '';
    this.loanDeposit.amount = '0.0';
    this.loanDeposit.status = '1';
    this.loanDeposit.note = '-';
    this.loanDeposit.req_date = '';
    this.loanDeposit.req_user = '-1';

    this.loanDeposit.user_set_req_date = today;
  }

  getAllLoanDeposits() {
    this.loanDeposits = [];
    this.loanDepositsService.getAllMemberLoanDeposits().subscribe((data: any) => {
        this.loanDeposits = data;
        this.financeService.addIndex(this.loanDeposits);
        this.drawTable();
      }, (err) => {
        this.notifi.error('While fetching Deposit details');
        this.loanDepositsDataTable.clear();
        this.loanDepositsDataTable.draw();
      }
    );
  }

  getActiveMemberLoans() {
    this.loans = [];
    this.loanDepositsService.getActiveMemberLoans().subscribe((data: any) => {
        this.loans = data;
        this.financeService.addIndex(this.loans);
      }, (err) => {
        this.notifi.error('While fetching Member details');
      }
    );
  }

  refreshLoanDeposits() {
    this.loanDepositsDataTableSearch = '';
    this.getAllLoanDeposits();
    this.getActiveMemberLoans();
    this.searchData();
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.loanDepositsDataTable) {
      this.loanDepositsDataTable = $('#loanDepositsDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.loanDepositsDataTableLength,
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
              $(win.document.body).find('h1').text('Loan Deposits');
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
          },
          {
            className: 'text-right',
            targets: [5]
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
    $('#loanDepositsDataTable tbody td').unbind();

    // defined jquery click event
    $('#loanDepositsDataTable tbody td').on('click', 'button', function() {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.loanDepositsDataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('editLoanDeposit')) {
        currClassRef.clickEditLoanDeposit(row.data()[0]);
      } else if ($(this).hasClass('deleteLoanDeposit')) {
        currClassRef.clickDeleteLoanDeposit(row.data()[0]);
      } else if ($(this).hasClass('gotoCustomer')) {
        currClassRef.gotoCustomer(row.data()[0]);
      } else if ($(this).hasClass('gotoLoan')) {
        currClassRef.gotoLoan(row.data()[0]);
      }

    });
  }

  searchData() {
    this.loanDepositsDataTable.search(this.loanDepositsDataTableSearch).draw();
  }

  setDatatableLength() {
    this.loanDepositsDataTable.page.len(this.loanDepositsDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.customerDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.loanDepositsDataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

// Draw once all updates are done
//     this.dataTable.rows().clear().draw();
    for (const deposit of this.loanDeposits) {
      let action =
        '<button class="btn btn-mini btn-warning editLoanDeposit" > <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteLoanDeposit"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      const memberID =
        `<button class="btn btn-mini btn-info gotoCustomer">` + this.financeService.getCustomerCode(deposit.member_id) + `</button>`;
      const loanID =
        `<button class="btn btn-mini btn-info gotoLoan">` + this.financeService.getLoanCode(deposit.member_loan_id) + `</button>`;


      if (deposit.status === '4') {
        action = '';
      }

      this.loanDepositsDataTable.row.add([deposit.index, this.financeService.getDepositCode(deposit.id),
        loanID,
        memberID,
        deposit.req_date, this.financeService.cents2rupees(deposit.amount), deposit.note,
        this.loanDepositStatus[deposit.status],
        deposit.updated_by, action]);

    }
    this.loanDepositsDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}
