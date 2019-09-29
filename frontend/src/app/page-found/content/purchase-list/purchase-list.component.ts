import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'src/app/utils/notifications';
import { PurchaseListService } from './purchase-list.service';
import { DatePipe } from '@angular/common';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {
  statusInfo = {
    0: { Status: 'Deleted', Style: 'badge-primary' },
    1: { Status: 'Paid', Style: 'badge-success' },
    3: { Status: 'Pending', Style: 'badge-info' },
    4: { Status: 'Cancelled', Style: 'badge-danger' },
  };

  tempgrnData: any[] = [];
  tempStockReturn: any[] = [];
  grns: any[] = [];
  stockReturn: any[] = [];
  purchase: any[] = [];
  purchaseDailyTable: any;
  purchaseMonthlyTable: any;
  purchaseDataTableRange: any;
  purchaseDailyDataTableLength = 10;
  purchaseMonthlyDataTableLength = 10;
  purchaseDataTableSearch = '';
  purchaseProducts: any[] = [];
  total = 0;
  date = '';
  dateFilter = {
    dateFrom: '',
    dateTo: '',
    changeDate: ''
  };
  private _uiModel = {
    dailyTable: false,
    monthlyTable: false,
    dateFilter: false,
    dateRangeFilter: false
  };
  radio = {
    select: ''
  };


  constructor(private purchaseListService: PurchaseListService, private notifi: NotificationsService, public datepipe: DatePipe) {
    // this.radioBtnAction('daily');
  }

  ngOnInit() {
  }

  // getAllInvoiceProducts() {
  //   this.purchaseProducts = [];
  //   this.invoiceListService.getProductsOfAnInvoice(this.purchase).subscribe((data: any) => {
  //     this.invoiceProducts = data;
  //   }, (err) => {
  //     this.notifi.error('While fetching invoice products');
  //   }
  //   );
  // }

  getAllGRN() {
    this.tempgrnData = [];
    this.purchaseListService.getAllGrns().subscribe((data: any) => {
      this.tempgrnData = data;
      console.log(this.tempgrnData);

      this.addIndex(this.tempgrnData);
      for (let inv of this.tempgrnData) {
        this.grns.push(inv);
      }
    }, (err) => {
      this.notifi.error('While fetching invoice details');
      this.purchaseDailyTable.clear();
      this.purchaseDailyTable.draw();
      this.purchaseMonthlyTable.clear();
      this.purchaseMonthlyTable.draw();
    }
    );
  }

  getStockReturn() {
    this.tempStockReturn = [];
    this.purchaseListService.getStockReturn().subscribe((data: any) => {
      this.tempStockReturn = data;
      console.log(this.tempStockReturn);

      this.addIndex(this.tempStockReturn);
      for (let ret of this.tempStockReturn) {
        this.stockReturn.push(ret);
      }
    }, (err) => {
      this.notifi.error('While fetching details');
      this.purchaseDailyTable.clear();
      this.purchaseDailyTable.draw();
      this.purchaseMonthlyTable.clear();
      this.purchaseMonthlyTable.draw();
    });
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllGRN();
    this.getStockReturn();
    // this.radioBtnAction('daily');
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  // viewInvoice(index) {
  //   this.invoice = this.invoices[index];
  //   this.getAllInvoiceProducts();
  //   $('#viewInvoice').modal({ backdrop: 'static', keyboard: false });
  // }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.purchaseDailyTable) {
      this.purchaseDailyTable = $('#purchaseDailyTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: false,
        pageLength: this.purchase.length,
        responsive: false,
        sDom: 'Btipr',
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
              $(win.document.body).find('h1').text('Purchase List');
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
    else if (!this.purchaseMonthlyTable) {
      this.purchaseMonthlyTable = $('#purchaseMonthlyTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.purchaseMonthlyDataTableLength,
        responsive: false,
        sDom: 'Btipr',
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
              $(win.document.body).find('h1').text('Purchase List');
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
    $('#purchaseDailyTable tbody td').unbind();
    // $('#invoiceMonthlyTable tbody td').unbind();

    // defined jquery click event
    $('#purchaseDailyTable tbody td').on('click', 'button', function () {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.purchaseDailyTable.row(tr);
      // const row = currClassRef.invoiceMonthlyTable.row(tr);

      // this of jquery object
      // if ($(this).hasClass('viewInvoice')) {
      //   // use function of current class using reference
      //   currClassRef.viewInvoice(row.data()[0]);
      // }

    });
  }

  // searchData() {
  //   this.invoiceDailyTable.search(this.invoiceDataTableSearch).draw();
  // }

  setDatatableLength(table: string) {
    if (table == 'daily') {
      this.purchaseDailyTable.page.len(this.purchaseDailyDataTableLength).draw();
    } else if (table == 'monthly') {
      this.purchaseMonthlyTable.page.len(this.purchaseMonthlyDataTableLength).draw();
    }
  }

  drawDailyDataTable() {
    this.initDataTable();
    this.purchaseDailyTable.clear();
    for (const sal of this.purchase) {
      // let date = this.datepipe.transform(inv.issued_date, 'yyyy-MM-dd');
      let time = this.datepipe.transform(sal.issued_time, 'HH:mm:ss');
      let status = '<label class="label label-default">Unknows</label>';
      if (sal.GRN == 'GRN') {
        status = '<label class="label label-inverse-success">GRN</label>';
      } else if (sal.STRE == 'STRE') {
        status = '<label class="label label-inverse-warning">Stock Return</label>';
      }
      this.purchaseDailyTable.row.add([sal.index, time, status, sal.id, sal.invoice_issueddate || "---",
      Number(sal.discount).toLocaleString('en-GB') || "---", Number(sal.total).toLocaleString('en-GB')]);
    }
    this.purchaseDailyTable.draw();
  }

  drawMonthlyDataTable() {
    this.initDataTable();
    this.purchaseMonthlyTable.clear();
    for (const sal of this.purchase) {
      let date = this.datepipe.transform(sal.issued_time, 'yyyy-MM-dd');
      let time = this.datepipe.transform(sal.issued_time, 'HH:mm:ss');
      let status = '<label class="label label-default">Unknows</label>';
      if (sal.GRN == 'GRN') {
        status = '<label class="label label-inverse-success">GRN</label>';
      } else if (sal.STRE == 'STRE') {
        status = '<label class="label label-inverse-warning">Stock Return</label>';
      }
      this.purchaseMonthlyTable.row.add([sal.index, date, time, status, sal.id, sal.invoice_issueddate || "---",
      Number(sal.discount).toLocaleString('en-GB') || "---", Number(sal.total).toLocaleString('en-GB')]);
    }
    this.purchaseMonthlyTable.draw();
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
    this.grns = [];
    this.stockReturn = [];
    this.purchase = [];
    let min = this.dateFilter.dateFrom;
    let max = this.dateFilter.dateTo;
    for (let inv of this.tempgrnData) {
      let issued_date = this.datepipe.transform(inv.issued_time, 'yyyy-MM-dd');
      if (min == '' && max == '') {
        this.grns.push(inv);
        this.purchase.push(inv);
      } else if (min <= issued_date && max == '') {
        this.grns.push(inv);
        this.purchase.push(inv);
      } else if (max >= issued_date && min == '') {
        this.grns.push(inv);
        this.purchase.push(inv);
      } else if (min <= issued_date && max >= issued_date) {
        this.grns.push(inv);
        this.purchase.push(inv);
      }
    }
    for (let ret of this.tempStockReturn) {
      let issued_date = this.datepipe.transform(ret.issued_time, 'yyyy-MM-dd');
      if (min == '' && max == '') {
        this.grns.push(ret);
        this.purchase.push(ret);
      } else if (min <= issued_date && max == '') {
        this.grns.push(ret);
        this.purchase.push(ret);
      } else if (max >= issued_date && min == '') {
        this.grns.push(ret);
        this.purchase.push(ret);
      } else if (min <= issued_date && max >= issued_date) {
        this.grns.push(ret);
        this.purchase.push(ret);
      }
    }
    this.calTotal();
    this.drawMonthlyDataTable();
  }

  filterbyDate() {
    let today: Date = new Date();
    this.grns = [];
    this.stockReturn = [];
    this.purchase = [];
    let selectedDate = this.datepipe.transform(today, 'yyyy-MM-dd');
    this.date = selectedDate;
    for (let inv of this.tempgrnData) {
      let issued_date = this.datepipe.transform(inv.issued_time, 'yyyy-MM-dd');
      if (selectedDate == issued_date) {
        this.grns.push(inv);
        this.purchase.push(inv)
      }
    }
    for (let ret of this.tempStockReturn) {
      let issued_date = this.datepipe.transform(ret.issued_time, 'yyyy-MM-dd');
      if (selectedDate == issued_date) {
        this.grns.push(ret);
        this.purchase.push(ret);
      }
    }
    this.calTotal();
    this.drawDailyDataTable()
  }

  calTotal() {
    this.total = 0;
    let invtot = 0;
    let rettot = 0;
    for (let inv of this.grns) {
      let invTotal = Number(inv.total);
      invtot = invtot + invTotal;
    }
    for (let ret of this.stockReturn) {
      let retTotal = Number(ret.total);
      rettot = rettot + retTotal;
    }
    this.total = invtot - rettot;
  }
}

