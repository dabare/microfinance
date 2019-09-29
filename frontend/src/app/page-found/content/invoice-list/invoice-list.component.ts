import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import {InvoiceListService} from './invoice-list.service';
import {formatCurrency} from '@angular/common';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit, AfterViewInit {

  statusInfo = {
    0: {Status: 'Deleted', Style: 'badge-primary'},
    1: {Status: 'Paid', Style: 'badge-success'},
    3: {Status: 'Pending', Style: 'badge-info'},
    4: {Status: 'Cancelled', Style: 'badge-danger'},
  };

  invoices: any[] = [];
  invoiceDataTable: any;
  invoiceDataTableLength = 5;
  invoiceDataTableSearch = '';

  invoiceProducts: any[] = [];

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


  constructor(private invoiceListService: InvoiceListService, private notifi: NotificationsService) {
  }

  ngOnInit() {
  }

  getAllInvoiceProducts() {
    this.invoiceProducts = [];
    this.invoiceListService.getProductsOfAnInvoice(this.invoice).subscribe((data: any) => {
        this.invoiceProducts = data;
        console.log(data);
      }, (err) => {
        this.notifi.error('While fetching invoice products');
      }
    );
  }

  getAllInvoices() {
    this.invoices = [];
    this.invoiceListService.getAllInvoices().subscribe((data: any) => {
        this.invoices = data;
        console.log(data);
        this.addIndex(this.invoices);
        this.drawTable();
      }, (err) => {
      this.notifi.error('While fetching invoice details');
        this.invoiceDataTable.clear();
        this.invoiceDataTable.draw();
      }
    );
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllInvoices();
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  viewInvoice(index) {
    this.invoice = this.invoices[index];
    this.getAllInvoiceProducts();
    $('#viewInvoice').modal({backdrop: 'static', keyboard: false});
  }

  /////////////////////////////////////////////////////////////// datatable related code begin
  initDataTable() {
    if (!this.invoiceDataTable) {
      this.invoiceDataTable = $('#invoiceDataTable').DataTable({
        scrollX: false,
        scrollCollapse: true,
        paging: true,
        pageLength: this.invoiceDataTableLength,
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
              $(win.document.body).find('h1').text('Invoice List');
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
            targets: [9]
          },
          {
            className: 'text-right',
            targets: [6, 7, 8]
          },
          {
            className: 'text-center',
            targets: [1, 2, 3, 5, 9]
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
    $('#invoiceDataTable tbody td').unbind();

    // defined jquery click event
    $('#invoiceDataTable tbody td').on('click', 'button', function () {
      // the "this" in this function is "this" of jquery object not of component because we did not use an arrow function

      // get row for data
      const tr = $(this).closest('tr');
      const row = currClassRef.invoiceDataTable.row(tr);
      // this of jquery object
      if ($(this).hasClass('viewInvoice')) {
        // use function of current class using reference
        currClassRef.viewInvoice(row.data()[0]);
      }

    });
  }

  searchData() {
    this.invoiceDataTable.search(this.invoiceDataTableSearch).draw();
  }

  setDatatableLength() {
    this.invoiceDataTable.page.len(this.invoiceDataTableLength).draw();
  }

  drawTable() {
    this.initDataTable();
    this.invoiceDataTable.clear();
    for (const inv of this.invoices) {

      let status = '<label class="label label-default">Unknows</label>';

      if (inv.status === '1') {
        status = '<label class="label label-inverse-success">Paid</label>';
      } else if (inv.status === '3') {
        status = '<label class="label label-inverse-warning">Pending</label>';
      } else if (inv.status === '4') {
        status = '<label class="label label-danger">Cancelled</label>';
      }
      const action =
        ' <button type="button" class="btn btn-mini btn-success viewInvoice"> <i class="icofont icofont-eye-alt" aria-hidden="true"></i></button>';

      this.invoiceDataTable.row.add([inv.index, status, inv.id, inv.issued_date, inv.customer, inv.payment_type,
        inv.qty, Number(inv.discount).toLocaleString('en-GB'), Number(inv.total).toLocaleString('en-GB'), action]);
    }
    this.invoiceDataTable.draw();
  }

  /////////////////////////////////////////////////////////////// datatable related code end

}
