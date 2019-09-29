import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from './stock.service';
import { NotificationsService } from 'src/app/utils/notifications';
import Swal from 'sweetalert2';

declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, AfterViewInit {

  dataTableLength = 10;
  dataTableSearch = '';
  dataTable: any;

  showEdit = false;
  brand = {
    id: -1,
    brand_name: ''
  }
  cloth = {
    id: -1,
    cloth_name: ''
  }
  size = {
    id: -1,
    size_name: ''
  }

  actionMode = '';
  brands: any[] = [];
  cloths: any[] = [];
  sizes: any[] = [];
  products: any[] = [];
  product = {
    id: -1,
    brand: '',
    brand_id: -1,
    size: '',
    size_id: -1,
    cloth: '',
    cloth_id: -1,
    product_description: '',
    gender: '',
    notes: '',
    registered_date: '',
    userid: -1,
    available_qty: 0,
    alert_qty: 0,
    rating: 0,
    status: 0
  };
  product_regi = {
    product: this.product,
    brand: this.brand,
    size: this.size,
    cloth: this.cloth

  }
  model: NgbDateStruct;


  constructor(private stockService: StockService, private notifi: NotificationsService) {
  }
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {

    this.initDataTable();
    this.getAllProducts();
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }
  getAllProducts() {
    this.products = [];
    this.stockService.getAllStockProduct().subscribe((data: any) => {
      this.products = data;
      this.addIndex(this.products);
      this.drawTable();
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }


  removeProduct(i) {
    this.actionMode = 'delete';
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + this.products[i].product_description,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.product.id = currentClass.products[i].id;
          currentClass.stockService.deleteProduct(this.product).subscribe((data: any) => {
            currentClass.getAllProducts();
            currentClass.notifi.success('Product Deleted');
          }, (err) => {
            currentClass.notifi.error('While Deleting Product');
          }
          );
        }
      });


  }
  viewEachProduct(i) {
    this.actionMode = 'edit';
    this.product.id = this.products[i].id;
    this.product.brand_id = this.products[i].brand_id;
    this.product.size_id = this.products[i].size_id;
    this.product.cloth_id = this.products[i].cloth_id;
    this.brand.id = this.products[i].brand_id;
    this.size.id = this.products[i].size_id;
    this.cloth.id = this.products[i].cloth_id;
    this.product.gender = this.products[i].gender;
    this.product.product_description = this.products[i].product_description;
    this.product.notes = this.products[i].notes;
    this.product.available_qty = this.products[i].available_qty;
    this.product.alert_qty = this.products[i].alert_qty;
    this.product.status = this.products[i].status;

    $('#new_product').modal({ backdrop: 'static', keyboard: false });
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

        }, buttons: [
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
              $(win.document.body).find('h1').text('Customers');
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
      if ($(this).hasClass('editProduct')) {
        // use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);

        currClassRef.viewEachProduct(row.data()[0]);
      } else if ($(this).hasClass('deleteProduct')) {
        currClassRef.removeProduct(row.data()[0]);
      } else if ($(this).hasClass('adddiscount')) {

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
    // for (const pro of this.products) {
    for (var i = 0; i < this.products.length; i++) {
      let discount_action = '<button class="btn btn-mini btn-success adddiscount"> Discount</button>'
      let action =
        '<button class="btn btn-mini btn-danger deleteProduct"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      this.dataTable.row.add([this.products[i].index, this.products[i].product_description,
      this.products[i].gender, this.products[i].qty, this.products[i].available_qty, this.products[i].grn_id, this.products[i].name]);



      // if(this.products[i].pid==this.products[i+1].pid){
      //   this.dataTable.row.add([this.products[i].index,  '',
      //     this.products[i].gender, this.products[i].qty,this.products[i].available_qty, this.products[i].grn_id, this.products[i].name,action]);
      // }else{
      //   this.dataTable.row.add([this.products[i].index,  this.products[i].product_description,
      //     this.products[i].gender, this.products[i].qty,this.products[i].available_qty, this.products[i].grn_id, this.products[i].name,action]);
      // }

      // this.dataTable.row.add([pro.index, pro.id, pro.brand, pro.size, pro.cloth, pro.product_description,
      //   pro.gender, pro.notes, pro.registered_date, pro.alert_qty,  pro.rating, action]);
    }

    // }
    this.dataTable.draw();
    this.resetTableListners();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}

