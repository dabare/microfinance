import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { GRNService } from '../grn/grn.service';
import { GRNListService } from './grn-list.service';
import { NotificationsService } from 'src/app/utils/notifications';
import * as JsBarcode from 'jsbarcode';
import * as jsPDF from 'jspdf';
import * as printJS from 'print-js';

declare var $: any;
declare var jQuery: any;


interface BarcodePdfConfig {
  pageLeftMargine: number;
  pageTopMargine: number;
  barcodeWidth: number;
  barcodeHeight: number;
  textFontSize: number;
  boxWidth: number;
  boxHeight: number;
  boxLeftPadding: number;
  boxTopPadding: number;
  maxYCount: number;
  maxXCount: number;
  rotate: boolean;
  previewMultiplier: number;
}


@Component({
  selector: 'app-tables',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss']
})
export class GRNListComponent implements OnInit, AfterViewInit {

  dataTableLength = 10;
  dataTableSearch = '';
  dataTable: any;

  showEdit = false;
  pdfMode = 'no'

  actionMode = '';
  grn_list: any[] = [];
  suppliers: any[] = [];
  product_list: any[] = [];
  paymentHostory_list: any[] = [];
  product_return_list: any[] = [];
  paymentHostory = {
    id: -1,
    paid_amount: 0,
    paid_date: '',
    note: '',
    grnid: -1
  }
  grn = {
    id: -1,
    ref_no: '',
    supplier_id: -1,
    payment_type_grn_id: -1,
    total_qty: 0,
    total: 0.00,
    discount: 0.00,
    paid_amount: 0.00,
    due_amount: 0.00,
    userid: -1,
    notes: '',
    status: 1,
    status_name: '',
    name: '',
    invoice_issueddate: '',
    issued_time: '',
    pay_amount: 0,
    current_due: 0
  }
  product = {
    id: -1,
    product_description: '',
    buying_price: 0.00,
    qty: 0,
    subtotal: 0.00,
    return_qty: 0,
    printing_qty: 0,
    chreturn_status: false
  }
  return_regi = {
    id: -1,
    reason: '',
    total_qty: 0,
    total: 0.00,
    status: 1,
    grnid: -1,

  }
  return_products = {
    id: -1,
    stock_id: -1,
    qty: 0,
    return_qty: 0,
    stock_return_id: -1,
    status: -1,
    available_qty: 0,
  }
  tablelength = 0;
  stickertype = 'tag';
  constructor(private grnlistService: GRNListService, private notifi: NotificationsService) {
  }
  private doc: any;

  @ViewChild('pdfViewerAutoLoad', { static: false }) pdfViewerAutoLoad;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllGRNs();
    this.getNewStockReturnId();


  }
  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }
  calculateDue() {
    this.grn.current_due = Number(this.grn.due_amount) - Number(this.grn.pay_amount);
  }

  updatePayments() {
    console.log(this.grn);
    this.grnlistService.updatePayment(this.grn).subscribe((data: any) => {

      this.grnlistService.insertPaymentHistory(this.grn).subscribe((data: any) => {
        this.notifi.success('Made GRN due payment successfully');
        this.grn.pay_amount = 0;
        this.getAllGRNs();
        this.getNewStockReturnId();
        $('#updatePayment').modal('hide');
        this.initDataTable();
    this.getAllGRNs();
    this.getNewStockReturnId();
      }, (err) => {
        this.notifi.error('While updating GRN due payment');
      });
    }, (err) => {
      this.notifi.error('While updating GRN due payment');
    });

  }

  getAllGRNs() {
    this.grn_list = [];
    this.grnlistService.getAllGRNs().subscribe((data: any) => {
      this.grn_list = data;
      this.addIndex(this.grn_list);
      this.drawTable();
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }
  viewEachGRN(i) { 
    let grnid = this.grn_list[i].id;
    console.log(grnid);
    this.grnlistService.getGRNProduct(grnid).subscribe((data: any) => {
      this.product_list = data;

    }, (err) => {
    });
    this.grnlistService.getviewGRNReturnProducts(grnid).subscribe((data: any) => {
      console.log("ddddddddd");
      console.log(this.product_return_list);
      this.product_return_list = data;
    }, (err) => {
    }
    );
    this.grn.id = this.grn_list[i].id;
    this.grn.issued_time = this.grn_list[i].issued_time;
    this.grn.ref_no = this.grn_list[i].ref_no;
    this.grn.name = this.grn_list[i].name;
    this.grn.status = this.grn_list[i].status;
    this.grn.notes = this.grn_list[i].notes;
    this.grn.userid = 1;
    this.grn.total = this.grn_list[i].total;
    this.grn.discount = this.grn_list[i].discount;
    this.grn.paid_amount = this.grn_list[i].paid_amount;
    this.grn.due_amount = this.grn_list[i].due_amount;
    $('#productList').modal({ backdrop: 'static', keyboard: false });

  }
  viewEachGRNPayment(i) {
    console.log(this.grn_list[i]);
    let grnid = this.grn_list[i].id;
    this.grnlistService.getGRNProduct(grnid).subscribe((data: any) => {
      this.product_list = data;

    }, (err) => {
    });
    this.grnlistService.getviewGRNReturnProducts(grnid).subscribe((data: any) => {
      this.product_return_list = data;
    }, (err) => {
    }
    );

    this.grnlistService.getPaymentHistory(grnid).subscribe((data: any) => {
      this.paymentHostory_list = data;

    }, (err) => {
    });


    this.grn.id = this.grn_list[i].id;
    this.grn.current_due = Number(this.grn.due_amount) - Number(this.grn.pay_amount);
    this.grn.issued_time = this.grn_list[i].issued_time;
    this.grn.ref_no = this.grn_list[i].ref_no;
    this.grn.name = this.grn_list[i].name;
    this.grn.status = this.grn_list[i].status;
    this.grn.notes = this.grn_list[i].notes;
    this.grn.userid = 1;
    this.grn.total = this.grn_list[i].total;
    this.grn.discount = this.grn_list[i].discount;
    this.grn.paid_amount = this.grn_list[i].paid_amount;
    this.grn.due_amount = this.grn_list[i].due_amount;
    this.grn.current_due = Number(this.grn.due_amount) - Number(this.grn.pay_amount);
    $('#updatePayment').modal({ backdrop: 'static', keyboard: false });

  }


  getNewStockReturnId() {
    this.grnlistService.getNewStockReturnId().subscribe((data: any) => {
      this.return_regi.id = Number(data[0].id) + 1;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    });
  }
  returnProduct() {

    var total_products = 0;
    var tot = 0;
    for (var x = 0; x < this.product_list.length; x++) {

      if (this.product_list[x].return_status == true) {
        total_products += this.product_list[x].return_qty;
        this.return_regi.total_qty = total_products;
        var total = this.product_list[x].return_qty * this.product_list[x].buying_price;
        tot += total;
        this.return_regi.total = tot;
        this.return_regi.grnid = this.grn.id;

      }
    }
    this.grnlistService.insertReturnTotal(this.return_regi).subscribe((data: any) => {
      // this.notifi.success('Stock  returned');
      this.insertreturn_productRegi();
        this.notifi.success('Stock  returned');
        // this.return_regi.reason="";
    }, (err) => {
      this.notifi.error('While inserting GRN');
    }
    );
  }
  insertreturn_productRegi() {
    for (var x = 0; x < this.product_list.length; x++) {
      console.log(this.product_list[x]);
      if (this.product_list[x].return_status == true) {
        this.return_products.stock_id = this.product_list[x].id;
        this.return_products.return_qty = this.product_list[x].return_qty,
          this.return_products.qty = this.product_list[x].qty,
          this.return_products.available_qty = this.product_list[x].available_qty,
          this.return_products.return_qty = this.product_list[x].return_qty,
          this.return_products.stock_return_id = this.product_list[x].stock_return_id;
          this.return_products.id = this.product_list[x].pid;
          
        this.grnlistService.insertReturnRegi(this.return_products).subscribe((data: any) => {
          // this.notifi.success('Return product  returned');

        }, (err) => {
          this.notifi.error('While inserting Stock retun');
        });
        this.grnlistService.updateStockQty(this.return_products).subscribe((data: any) => {
          // this.notifi.success('Stock Updated');

        }, (err) => {
          this.notifi.error('While inserting Stock retun');
        });
        this.grnlistService.updateProductAvailableQty(this.return_products).subscribe((data: any) => {
          // this.notifi.success('Stock  returned');
      this.product.return_qty=0;
      this.return_regi.reason='';
          $('#productReturns').modal('hide');
          this.initDataTable();
          this.getAllGRNs();
          this.getNewStockReturnId();
        }, (err) => {
          this.notifi.error('While inserting Stock retun');
        });
      }
    }
  }
  viewReturns(i) {

    let grnid = this.grn_list[i].id;
    this.grnlistService.getGRNProduct(grnid).subscribe((data: any) => {
      for (var x = 0; x < data.length; x++) {
        data[x].stock_return_id = this.return_regi.id;
        if (data[x].return_status == 'false') {
          data[x].return_status = false;
        } else {
          data[x].return_status = true;
        }
      }
      this.product_list = data;
      this.tablelength = 1;
      console.log(this.product_list);
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );

    this.grn.id = this.grn_list[i].id;
    this.grn.notes = this.grn_list[i].notes;
    $('#productReturns').modal({ backdrop: 'static', keyboard: false });
  

  }

  viewBarcodes(i) {

    let grnid = this.grn_list[i].id;
    this.grnlistService.getGRNProduct(grnid).subscribe((data: any) => {
      for (var x = 0; x < data.length; x++) {
        data[x].stock_return_id = this.return_regi.id;
        if (data[x].return_status == 'false') {
          data[x].return_status = false;
        } else {
          data[x].return_status = true;
        }
      }
      this.product_list = data;
      this.tablelength = 1;
      console.log(this.product_list);
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );

    this.grn.id = this.grn_list[i].id;
    this.grn.notes = this.grn_list[i].notes;
    $('#productBarcode').modal({ backdrop: 'static', keyboard: false });

  }
  printProduct() {
    const data = [];



    for (let x = 0; x < this.product_list.length; x++) {
      console.log(this.product_list[x]);
      if (this.product_list[x].return_status) {
        data.push({ stockId: this.product_list[x].id, description: this.product_list[x].product_description, count: Number(this.product_list[x].printing_qty) });

      }
    }


    console.log(data);

    if (this.stickertype == 'tag') {
      this.sticker(data);
    } else {
      this.tag(data);
    }

    $('#productBarcode').modal('hide');
    // this.pdfMode = 'yes';
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
              $(win.document.body).find('h1').text('Purchase List');
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
            targets: [0, 13]
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
      if ($(this).hasClass('productList')) {
        // use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);

        currClassRef.viewEachGRN(row.data()[0]);
      } else if ($(this).hasClass('productReturns')) {
        currClassRef.viewReturns(row.data()[0]);
        // currClassRef.removeSupplier(row.data()[0]);
      } else if ($(this).hasClass('updatePayment')) {
        currClassRef.viewEachGRNPayment(row.data()[0]);
        // currClassRef.removeSupplier(row.data()[0]);
      } else if ($(this).hasClass('productBarcode')) {
        currClassRef.viewBarcodes(row.data()[0]);
        // currClassRef.removeSupplier(row.data()[0]);
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

    for (const grn of this.grn_list) {
      let status_pending = '<label class="label label-inverse-danger">Pending</label>';
      let status_done = '<label class="label label-inverse-success">Paid</label>';
      let status_can = '<label class="label label-warning">Cancelled</label>';
      let status_label = '';
      let barcode =
        ' <button class="btn btn-mini btn-success productBarcode" >Barcode</button>';
      let actionReturn =
        ' <button class="btn btn-mini btn-warning productReturns" >Return</button>';
      // let action =
      //   ' <button type="button" class="btn btn-mini btn-success productList" data-toggle="modal" data-target="#productList"> <i class="icofont icofont-eye-alt" aria-hidden="true"></i></button>' +
      //   '<button type="button" class="btn btn-mini btn-primary updatePayment" data-toggle="modal" data-target="#updatePayment"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button>' +
      //   '<button class="btn btn-mini  btn-danger"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button> ';
      let action =
        ' <button type="button" class="btn btn-mini btn-success productList" data-toggle="modal" data-target="#productList"> <i class="icofont icofont-eye-alt" aria-hidden="true"></i></button>' +
        '<button type="button" class="btn btn-mini btn-primary updatePayment" data-toggle="modal" data-target="#updatePayment"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button>';
      if (grn.due_amount > 0) {
        grn.status_name = 'Pending';
        status_label = status_pending;
      } else if (grn.due_amount == 0) {
        grn.status_name = 'Paid';
        status_label = status_done;
      }

      if (grn.status == 0) {
        grn.status_name = 'Cancelled';
        status_label = status_can;
      }
      this.dataTable.row.add([grn.index, status_label, grn.issued_time, grn.id, grn.ref_no, grn.invoice_issueddate, grn.notes,
      grn.name, grn.total, grn.discount, grn.paid_amount, grn.due_amount, barcode, actionReturn, action]);
    }
    this.dataTable.draw();
    this.resetTableListners();
  }



  // ************************************************* PRINT PDF *****************************************************

  sticker(data) {
    const config: BarcodePdfConfig = {
      pageLeftMargine: 6,
      pageTopMargine: 12,
      barcodeWidth: 34,
      barcodeHeight: 18,
      textFontSize: 26,
      boxWidth: 40,
      boxLeftPadding: 0,
      boxTopPadding: 0,
      boxHeight: 23,
      maxYCount: 12,
      maxXCount: 5,
      previewMultiplier: 8,
      rotate: false
    };
    this.drawPdf(data, config);
  }

  tag(data) {
    const config: BarcodePdfConfig = {
      pageLeftMargine: 0,
      pageTopMargine: 0,
      barcodeWidth: 50,
      barcodeHeight: 30,
      textFontSize: 40,
      boxWidth: 62,
      boxLeftPadding: 30,
      boxTopPadding: 0,
      boxHeight: 42,
      maxYCount: 3,
      maxXCount: 5,
      previewMultiplier: 8,
      rotate: true
    };

    this.drawPdf(data, config);
  }

  // leftPad(str: string, len: number, ch = '.'): string {
  //   len = len - str.length + 1;
  //   return len > 0 ?
  //     new Array(len).join(ch) + str : str;
  // }

  drawCanvas(stockId, description, config: BarcodePdfConfig) {
    const boxPreviewHeight = config.previewMultiplier * config.boxHeight;
    const boxPreviewWidth = config.previewMultiplier * config.boxWidth;
    const barcodePreviewHeight = config.previewMultiplier * config.barcodeHeight;

    // stockId = this.leftPad(stockId + '', 10, '0');
    const barcodeoptons = {
      format: 'CODE128',
      height: 50,
      displayValue: true
    };
    JsBarcode('#barcode', stockId, barcodeoptons);

    const barcode = document.getElementById('barcode') as HTMLCanvasElement;
    const preview = document.getElementById('preview') as HTMLCanvasElement;
    const previewCtx = preview.getContext('2d');

    preview.height = boxPreviewHeight;
    preview.width = boxPreviewWidth;

    previewCtx.fillStyle = 'white';
    previewCtx.fillRect(0, 0, preview.width, preview.height);
    previewCtx.drawImage(barcode, 0, 0, boxPreviewWidth, barcodePreviewHeight);
    previewCtx.fillStyle = 'black';
    previewCtx.textAlign = 'center';
    previewCtx.font = config.textFontSize + 'px Arial';
    previewCtx.fillText(description, preview.width / 2, barcodePreviewHeight + (boxPreviewHeight - barcodePreviewHeight) / 2);

    const previewRotated = document.getElementById('previewRotated') as HTMLCanvasElement;
    previewRotated.width = boxPreviewHeight;
    previewRotated.height = boxPreviewWidth;

    const previewRotatedCtx = previewRotated.getContext('2d');

    previewRotatedCtx.translate(previewRotatedCtx.canvas.width, 0);
    previewRotatedCtx.rotate(Math.PI / 2);
    // preview2Ctx.translate(-preview2Ctx.canvas.width / 2, -preview2Ctx.canvas.height / 2);

    previewRotatedCtx.fillStyle = 'white';
    previewRotatedCtx.fillRect(0, 0, preview.width, preview.height);
    previewRotatedCtx.drawImage(barcode, 0, 0, boxPreviewWidth, barcodePreviewHeight);
    previewRotatedCtx.fillStyle = 'black';
    previewRotatedCtx.textAlign = 'center';
    previewRotatedCtx.font = config.textFontSize + 'px Arial';
    previewRotatedCtx.fillText(description, preview.width / 2, barcodePreviewHeight + (boxPreviewHeight - barcodePreviewHeight) / 2);

    let imgData = preview.toDataURL('image/png', 1);
    if (config.rotate) {
      imgData = previewRotated.toDataURL('image/png', 1);
    }
    return imgData;
  }

  drawPdf(data, config: BarcodePdfConfig) {
    this.doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      hotfixes: [] // an array of hotfix strings to enable
    });

    let count = 0;
    for (const item of data) {
      count += item.count;
    }
    let currentItem = 0;
    while (count) {
      for (let y = 0; count; y++) {
        if (y && y % config.maxYCount === 0) {
          this.doc.addPage();
          y = 0;
        }
        for (let x = 0; x < config.maxXCount && count; x++) {
          const imgData = this.drawCanvas(data[currentItem].stockId, data[currentItem].description, config);
          if (config.rotate) {
            this.doc.addImage(imgData, 'PNG',
              config.pageTopMargine + config.boxTopPadding + x * (config.boxHeight + config.boxTopPadding),
              config.pageLeftMargine + config.boxLeftPadding + y * (config.boxWidth + config.boxLeftPadding),
              config.boxHeight, config.boxWidth);
          } else {
            this.doc.addImage(imgData, 'PNG',
              config.pageLeftMargine + config.boxLeftPadding + x * (config.boxWidth + config.boxLeftPadding),
              config.pageTopMargine + config.boxTopPadding + y * (config.boxHeight + config.boxTopPadding),
              config.boxWidth, config.boxHeight);
          }
          count--;
          data[currentItem].count--;
          if (data[currentItem].count === 0) {
            currentItem++;
          }
        }
      }
    }


    printJS(this.doc.output('bloburl'));
    // this.pdfViewerAutoLoad.pdfSrc = this.doc.output('bloburl'); // pdfSrc can be Blob or Uint8Array
    // this.pdfViewerAutoLoad.refresh(); // Ask pdf viewer to load/refresh pdf
  }
}









