import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import Swal from 'sweetalert2';
import {SavingRateService} from './saving-rate.service';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './saving-rate.component.html',
  styleUrls: ['./saving-rate.component.scss']
})
export class SavingRateComponent implements OnInit, AfterViewInit {

  status = {
    0: 'Deleted',
    1: 'Active',
    4: 'Cancelled'
  };

  savingsRateDataTableLength = 5;
  savingsRateDataTableSearch = '';
  savingsRateDataTable: any;

  actionMode = '';

  loans: any[] = [];

  loan = {
    id: -1,
    description: '-',
    rate: '1',
    status: '1',
    req_date: '',
    user_set_req_date: null,
    req_user: '-1'
  };

  constructor(private loansService: SavingRateService, private notifi: NotificationsService) {
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
    this.loan.req_date = this.loan.user_set_req_date.year + '-' + this.loan.user_set_req_date.month + '-' + this.loan.user_set_req_date.day;

    this.loansService.insertMemberSavingRate(this.loan).subscribe((data: any) => {
        this.getAllLoans();
        this.notifi.success('Savings Rate saved');
        $('#new_Loan').modal('hide');
      }, (err) => {
        this.notifi.error('While inserting Savings Rate');
      }
    );
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  clickEditLoan(i) {
    this.actionMode = 'edit';
    this.clearLoan();

    this.loan.id = this.loans[i].id;
    this.loan.rate = this.loans[i].rate;
    this.loan.status = this.loans[i].status;
    this.loan.description = this.loans[i].description;
    this.loan.req_date = this.loans[i].req_date;
    this.loan.user_set_req_date.day = Number(this.loans[i].req_date.split('-')[2]);
    this.loan.user_set_req_date.month = Number(this.loans[i].req_date.split('-')[1]);
    this.loan.user_set_req_date.year = Number(this.loans[i].req_date.split('-')[0]);
    this.loan.req_user = this.loans[i].req_user;

    $('#new_Loan').modal({backdrop: 'static', keyboard: false});
  }

  clickUpdateLoan() {
    this.loan.req_date = this.loan.user_set_req_date.year + '-' + this.loan.user_set_req_date.month + '-' + this.loan.user_set_req_date.day;

    this.loansService.updateMemberSavingRate(this.loan).subscribe((data: any) => {
        this.getAllLoans();
        this.notifi.success('Savings Rate Updated');
        $('#new_Loan').modal('hide');
      }, (err) => {
        this.notifi.error('While Updating Savings Rate');
      }
    );
  }

  clickDeleteLoan(i) {
    this.actionMode = 'delete';
    this.clearLoan();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Cancel ' + this.loans[i].rate,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.loan.id = currentClass.loans[i].id;
          currentClass.loansService.cancelMemberSavingRate(this.loan).subscribe((data: any) => {
              currentClass.getAllLoans();
              currentClass.notifi.success('Savings Rate Cancelled');
            }, (err) => {
              currentClass.notifi.error('While Cancelling Savings Rate');
            }
          );
        }
      });
  }

  clearLoan() {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();


    this.loan.id = -1;
    this.loan.description = '-';
    this.loan.rate = '1';
    this.loan.status = '1';
    this.loan.req_date = '';
    this.loan.req_user = '-1';

    this.loan.user_set_req_date = today;
  }

  getAllLoans() {
    this.loans = [];
    this.loansService.getAllMemberSavingRates().subscribe((data: any) => {
        this.loans = data;
        this.addIndex(this.loans);
        this.drawTable();
      }, (err) => {
        this.notifi.error('While fetching Savings Rate details');
        this.savingsRateDataTable.clear();
        this.savingsRateDataTable.draw();
      }
    );
  }


  refreshLoans() {
    this.savingsRateDataTableSearch = '';
    this.getAllLoans();
    this.searchData();
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.savingsRateDataTable) {
      this.savingsRateDataTable = $('#savingsRateDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.savingsRateDataTableLength,
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
              $(win.document.body).find('h1').text('Saving Rate History');
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
            targets: [0, 6]
          },
          {
            visible: false,
            targets: [0]
          },
          {
            className: 'text-right',
            targets: [1]
          }],
        order: [[0, 'asc']],
      });
    }
  }

  resetTableListners() {
    // store current class reference in _currClassRef variable for using in jquery click event handler
    const currClassRef = this;

    // unbind previous event on tbody so that multiple events are not binded to the table whenever this function runs again
    $('#savingsRateDataTable tbody td').unbind();

    // defined jquery click event
    $('#savingsRateDataTable tbody td').on('click', 'button', function() {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.savingsRateDataTable.row(tr);
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
    this.savingsRateDataTable.search(this.savingsRateDataTableSearch).draw();
  }

  setDatatableLength() {
    this.savingsRateDataTable.page.len(this.savingsRateDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    // this.customerDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
    //   this.invalidate();
    // });
    this.savingsRateDataTable.clear();
    // this.datatable.clear();
    // this.datatable.rows.add(this.doctors);
    // this.datatable.draw();

// Draw once all updates are done
//     this.dataTable.rows().clear().draw();
    for (const loan of this.loans) {
      let action =
        '<button class="btn btn-mini btn-warning editLoan" > <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteLoan"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      if (loan.status === '4') {
        action = '';
      }

      this.savingsRateDataTable.row.add([loan.index, loan.rate + '%', loan.req_date, loan.description, loan.updated_by,
         this.status[loan.status], action]);

    }
    this.savingsRateDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}
