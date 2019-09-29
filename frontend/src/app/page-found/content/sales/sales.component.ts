import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/utils/notifications';
import { SalesListService } from './sales.service';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import * as printJS from 'print-js';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-tables',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  statusInfo = {
    0: { Status: 'Deleted', Style: 'badge-primary' },
    1: { Status: 'Paid', Style: 'badge-success' },
    3: { Status: 'Pending', Style: 'badge-info' },
    4: { Status: 'Cancelled', Style: 'badge-danger' },
  };

  tempInvoiceData: any[] = [];
  tempSalesReturn: any[] = [];
  invoices: any[] = [];
  salesReturn: any[] = [];
  sales: any[] = [];
  invoiceDailyTable: any;
  invoiceMonthlyTable: any;
  invoiceDataTableRange: any;
  invoiceDailyDataTableLength = 10;
  invoiceMonthlyDataTableLength = 10;
  invoiceDataTableSearch = '';
  invoiceProducts: any[] = [];
  total = 0;
  date = '';


  invoice = {
    id: '',
    customer_id: '1', // default
    payment_type_invoice_id: '-1',
    qty: '0',
    discount: '0',
    total: '0',
    issued_date: '',
    return: '0',
    gift: '0',
    userid: '-1',
    status: '3',
    paid_amount: '0',
    gross_amount: '0',
    payment_type: '',
    customer: '',
  };
  dateFilter = {
    dateFrom: '',
    dateTo: '',
    changeDate: ''
  };
  public _uiModel = {
    dailyTable: false,
    monthlyTable: false,
    dateFilter: false,
    dateRangeFilter: false
  };
  radio = {
    select: ''
  };


  constructor(private invoiceListService: SalesListService, private notifi: NotificationsService, public datepipe: DatePipe) {
    // this.radioBtnAction('daily');
  }

  ngOnInit() {
  }

  getAllInvoiceProducts() {
    this.invoiceProducts = [];
    this.invoiceListService.getProductsOfAnInvoice(this.invoice).subscribe((data: any) => {
      this.invoiceProducts = data;
    }, (err) => {
      this.notifi.error('While fetching invoice products');
    }
    );
  }

  getAllInvoices() {
    this.tempInvoiceData = [];
    this.invoiceListService.getAllInvoices().subscribe((data: any) => {
      this.tempInvoiceData = data;
      this.addIndex(this.tempInvoiceData);
      for (let inv of this.tempInvoiceData) {
        this.invoices.push(inv);
      }
    }, (err) => {
      this.notifi.error('While fetching invoice details');
      this.invoiceDailyTable.clear();
      this.invoiceDailyTable.draw();
      this.invoiceMonthlyTable.clear();
      this.invoiceMonthlyTable.draw();
    }
    );
  }

  getSalesReturn() {
    this.tempSalesReturn = [];
    this.invoiceListService.getSalesReturn().subscribe((data: any) => {
      this.tempSalesReturn = data;
      this.addIndex(this.tempSalesReturn);
      for (let ret of this.tempSalesReturn) {
        this.salesReturn.push(ret);
      }
    }, (err) => {
      this.notifi.error('While fetching details');
      this.invoiceDailyTable.clear();
      this.invoiceDailyTable.draw();
      this.invoiceMonthlyTable.clear();
      this.invoiceMonthlyTable.draw();
    });
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllInvoices();
    this.getSalesReturn();
    this.radioBtnAction('daily');
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  viewInvoice(index) {
    this.invoice = this.invoices[index];
    this.getAllInvoiceProducts();
    $('#viewInvoice').modal({ backdrop: 'static', keyboard: false });
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.invoiceDailyTable) {
      this.invoiceDailyTable = $('#invoiceDailyTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: false,
        pageLength: this.sales.length,
        responsive: false,
        dom: 'Btipr',
        searching: true,
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
              $(win.document.body).find('h1').text('Sales List');
            }
          },
          'copy', 'csv', 'excel', 'pdf'
        ],
        fnDrawCallback: (osSettings) => {
          this.resetaTableListners();
        },
        columnDefs: [
          {
            searchable: false,
            sortable: false,
            targets: [6]
          },
          // {
          //   className: 'text-right',
          //   targets: [6, 7, 8]
          // },
          {
            className: 'text-center',
            targets: [1, 2, 3, 4, 5, 6]
          },
          {
            visible: false,
            targets: [0]
          },
          {
            targets: [0],
            orderData: [0, 1]
          }],
        order: [[0, 'asc']],
      });
    }
    else if (!this.invoiceMonthlyTable) {
      this.invoiceMonthlyTable = $('#invoiceMonthlyTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.invoiceMonthlyDataTableLength,
        responsive: false,
        dom: 'Btipr',
        searching: true,
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
              $(win.document.body).find('h1').text('Sales List');
            }
          },
          'copy', 'csv', 'excel', 'pdf'
        ],
        fnDrawCallback: (osSettings) => {
          // this.resetTableListners();
        },
        columnDefs: [
          {
            searchable: false,
            sortable: false,
            targets: [7]
          },
          // {
          //   className: 'text-right',
          //   targets: [6, 7, 8]
          // },
          {
            className: 'text-center',
            targets: [1, 2, 3, 4, 5, 6, 7]
          },
          {
            visible: false,
            targets: [0]
          }],
        order: [[0, 'asc']],
      });
    }
  }

  resetaTableListners() {
    // store current class reference in _currClassRef variable for using in jquery click event handler
    const currClassRef = this;

    // unbind previous event on tbody so that multiple events are not binded to the table whenever this function runs again
    $('#invoiceDailyTable tbody td').unbind();
    // $('#invoiceMonthlyTable tbody td').unbind();

    // defined jquery click event
    $('#invoiceDailyTable tbody td').on('click', 'button', function () {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.invoiceDailyTable.row(tr);
      // const row = currClassRef.invoiceMonthlyTable.row(tr);

      // this of jquery object
      if ($(this).hasClass('viewInvoice')) {
        // use function of current class using reference
        currClassRef.viewInvoice(row.data()[0]);
      }

    });
  }

  // searchData() {
  //   this.invoiceDailyTable.search(this.invoiceDataTableSearch).draw();
  // }

  setDatatableLength(table: string) {
    if (table == 'daily') {
      this.invoiceDailyTable.page.len(this.invoiceDailyDataTableLength).draw();
    } else if (table == 'monthly') {
      this.invoiceMonthlyTable.page.len(this.invoiceMonthlyDataTableLength).draw();
    }
  }

  drawDailyDataTable() {
    this.initDataTable();
    this.invoiceDailyTable.clear();
    for (const sal of this.sales) {
      // let date = this.datepipe.transform(inv.issued_date, 'yyyy-MM-dd');
      let time = this.datepipe.transform(sal.issued_date, 'HH:mm:ss');
      let status = '<label class="label label-default">Unknows</label>';
      if (sal.INV == 'INV') {
        status = '<label class="label label-inverse-success">Invoice</label>';
      } else if (sal.SRE == 'SRE') {
        status = '<label class="label label-inverse-warning">Sales Return</label>';
      }
      this.invoiceDailyTable.row.add([sal.index, time, status, sal.id, sal.payment_type || "---",
      Number(sal.discount).toLocaleString('en-GB') || "---", Number(sal.total).toLocaleString('en-GB')]);
    }
    this.invoiceDailyTable.draw();
  }

  drawMonthlyDataTable() {
    this.initDataTable();
    this.invoiceMonthlyTable.clear();
    for (const sal of this.sales) {
      let date = this.datepipe.transform(sal.issued_date, 'yyyy-MM-dd');
      let time = this.datepipe.transform(sal.issued_date, 'HH:mm:ss');
      let status = '<label class="label label-default">Unknows</label>';
      if (sal.INV == 'INV') {
        status = '<label class="label label-inverse-success">Invoice</label>';
      } else if (sal.SRE == 'SRE') {
        status = '<label class="label label-inverse-warning">Sales Return</label>';
      }
      this.invoiceMonthlyTable.row.add([sal.index, date, time, status, sal.id, sal.payment_type || "---",
      Number(sal.discount).toLocaleString('en-GB'), Number(sal.total).toLocaleString('en-GB')]);
    }
    this.invoiceMonthlyTable.draw();
  }
  /////////////////////////////////////////////////////////////// datatable related code end

  radioBtnAction(radioValue: string) {
    this.radio.select = radioValue;
    if (this.radio.select == 'daily') {
      this._uiModel.dateFilter = true;
      this._uiModel.dateRangeFilter = false;
      this._uiModel.dailyTable = true;
      this._uiModel.monthlyTable = false;
      this.filterbyDate();
    } if (this.radio.select == 'monthly') {
      this._uiModel.dateFilter = false;
      this._uiModel.dateRangeFilter = true
      this._uiModel.dailyTable = false;
      this._uiModel.monthlyTable = true
      this.filterByDateRange();
    }
  }

  filterByDateRange() {
    this.invoices = [];
    this.salesReturn = [];
    this.sales = [];
    let min = this.dateFilter.dateFrom;
    let max = this.dateFilter.dateTo;
    for (let inv of this.tempInvoiceData) {
      let issued_date = this.datepipe.transform(inv.issued_date, 'yyyy-MM-dd');
      if (min == '' && max == '') {
        this.invoices.push(inv);
        this.sales.push(inv);
      } else if (min <= issued_date && max == '') {
        this.invoices.push(inv);
        this.sales.push(inv);
      } else if (max >= issued_date && min == '') {
        this.invoices.push(inv);
        this.sales.push(inv);
      } else if (min <= issued_date && max >= issued_date) {
        this.invoices.push(inv);
        this.sales.push(inv);
      }
    }
    for (let ret of this.tempSalesReturn) {
      let issued_date = this.datepipe.transform(ret.issued_date, 'yyyy-MM-dd');
      if (min == '' && max == '') {
        this.salesReturn.push(ret);
        this.sales.push(ret)
      } else if (min <= issued_date && max == '') {
        this.salesReturn.push(ret);
        this.sales.push(ret)
      } else if (max >= issued_date && min == '') {
        this.salesReturn.push(ret);
        this.sales.push(ret)
      } else if (min <= issued_date && max >= issued_date) {
        this.salesReturn.push(ret);
        this.sales.push(ret)
      }
    }
    this.calTotal();
    this.drawMonthlyDataTable();
  }

  filterbyDate() {
    let today: Date = new Date();
    this.invoices = [];
    this.salesReturn = [];
    this.sales = [];
    let selectedDate = this.datepipe.transform(today, 'yyyy-MM-dd');
    this.date = selectedDate;
    for (let inv of this.tempInvoiceData) {
      let issued_date = this.datepipe.transform(inv.issued_date, 'yyyy-MM-dd');
      if (selectedDate == issued_date) {
        this.invoices.push(inv);
        this.sales.push(inv);
      }
    }
    for (let ret of this.tempSalesReturn) {
      let issued_date = this.datepipe.transform(ret.issued_date, 'yyyy-MM-dd');
      if (selectedDate == issued_date) {
        this.salesReturn.push(ret);
        this.sales.push(ret)
      }
    }
    this.calTotal();
    this.drawDailyDataTable()
  }

  calTotal() {
    this.total = 0;
    let invtot = 0;
    let rettot = 0;
    for (let inv of this.invoices) {
      let invTotal = Number(inv.total);
      invtot = invtot + invTotal;
    }
    for (let ret of this.salesReturn) {
      let retTotal = Number(ret.total);
      rettot = rettot + retTotal;
    }
    this.total = invtot - rettot;
  }
}
