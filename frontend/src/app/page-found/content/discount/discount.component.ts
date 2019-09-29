import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DiscountService } from './discount.service';
import { NotificationsService } from 'src/app/utils/notifications';
import Swal from 'sweetalert2';
import { ProductService } from '../product/product.service';
declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss'],
})
export class DiscountComponent implements OnInit, AfterViewInit {

  dataTableLength = 5;
  dataTableSearch = '';
  dataTable: any;

  showEdit = false;


  actionMode = 'new';
  discounts: any[] = [];
  discount = {
    id: -1,
    type: '',
    name: '',
    discount_percentage: 0,
    from_date: '',
    to_date: '',
    added_date: '',
    status: 1,
    userid: -1,

  }
  product = {
    id: -1,
    product_description: '',
    pid: -1,
    sid: -1,
    available_qty: 0,
    buying_price: 0,
    selling_price: 0,
    profit_percentage: 0,
    status: 0,

  };

  dicount_produt = {
    id: -1,
    pid: -1,
    status: 1,
    sid: 1,
    discountid: -1,
    selling_price: 0,
  }
  products: any[] = [];
  products_one: Array<any> = [];
  products_all: Array<any> = [];
  constructor(private discountService: DiscountService, private productService: ProductService, private notifi: NotificationsService) {
  }

  ngOnInit(): void {
    this.clearDiscount();
  }

  ngAfterViewInit(): void {
    this.initDataTable();
    this.getAllDiscounts();
    this.getAllProducts();
    this.getNewDiscount();
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }
  getAllDiscounts() {
    this.discounts = [];
    this.discountService.viewAllDiscounts().subscribe((data: any) => {
      this.discounts = data;
      this.addIndex(this.discounts);
      this.drawTable();
    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }
  getAllProducts() {
    this.products = [];
    this.discountService.getAllProducts().subscribe((data: any) => {
      this.products = data;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }
  getNewDiscount() {
    this.products = [];
    this.discountService.getNewDiscount().subscribe((data: any) => {
      this.discount.id = Number(data[0].id) + 1;

      this.dicount_produt.discountid = this.discount.id;
    }, (err) => {
    });
  }
  AddRow(i) { 
      console.log(this.products_all);
    this.discountService.getStockProducts(i).subscribe((data: any) => {
      data[0].discounted_price = 0;
      data[0].discountid = this.discount.id;
      data[0].discounted_price = data[0].selling_price - (data[0].selling_price * (this.discount.discount_percentage / 100));

      this.products_one = data;

      const productone = this.products_one[0];
      this.products_all.push(productone); 
      this.products_one.splice(0, 1);

    }, (err) => {
    }
    );

  }


  clickNewDiscount() {
    this.actionMode = 'new';
    // $('#new_Customer').modal('show');
    this.clearDiscount();
    $('#new_discount').modal({ backdrop: 'static', keyboard: false });
  }

  RegisterDiscount() {
    if (this.discount.name) {
      this.discountService.insertDiscout(this.discount).subscribe((data: any) => {
        // this.getAllSuppliers();
        this.registerStock();
        this.notifi.success('Discount added');

      }, (err) => {
        this.notifi.error('While inserting discout');
      });
    } else {
      this.notifi.notice('Please provide a relavant details');
    }

  }

  registerStock() { 
    for (var x = 0; x < this.products_all.length; x++) { 
      this.dicount_produt = this.products_all[x];
      this.dicount_produt.pid=this.products_all[x].pid;
      this.dicount_produt.discountid=this.products_all[x].discountid;
      this.dicount_produt.status=0;
      this.dicount_produt.sid=this.products_all[x].sid;
      console.log(  this.dicount_produt);
      this.discountService.insertDiscountStock(this.dicount_produt).subscribe((data: any) => {

        this.notifi.success('Stock added');
        // this.clearGRN();
        // this.updateSellingPrice();
        // this.clearDiscount();

      }, (err) => {
        this.notifi.error('While inserting Product');
      }
      );
    }
    this.clearDiscount();

  }
  updateSellingPrice() {

    for (var x = 0; x < this.products_all.length; x++) {
      this.dicount_produt = this.products_all[x];
      this.discountService.updateSellingPrice(this.dicount_produt).subscribe((data: any) => {
        this.notifi.success('Selling price updated');
        // this.clearGRN();

      }, (err) => {
        this.notifi.error('While Selling price updated');
      }
      );
    }

  }
  deleteDiscount(i) {
    this.actionMode = 'delete';
    this.clearDiscount();
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete ' + this.discounts[i].name,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, delete!'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          currentClass.discount.id = currentClass.discounts[i].id;
          currentClass.discountService.deleteDiscount(  currentClass.discount.id ).subscribe((data: any) => {
            // currentClass.getAllSuppliers();
            currentClass.notifi.success('Discount Deleted');
          this.getAllDiscounts();
          }, (err) => {
            currentClass.notifi.error('While Deleting discount');
          }
          );
        }
      });

  }
  clearDiscount() {
    this.discount.type='';
    this.discount.name='';
    this.discount.from_date='';
    this.discount.to_date='';
    this.discount.discount_percentage=0;
    this.product.id=-1;
    this.products_all.length=0;
    this.getAllDiscounts();
    this.actionMode='new';
this.getNewDiscount();

  }
  removeRow(id: any) {
    this.products_one.push(this.products_all[id]);
    this.products_all.splice(id, 1);
  }
  viewEachDiscount(i) {
    this.products_all = [];
    this.actionMode = 'edit';
    this.products = [];
    this.discountService.getEachDiscounts(this.discounts[i].id).subscribe((data: any) => {
      this.discount.id = data[0].id;
      this.discount.type = data[0].type;
      this.discount.name = data[0].name;
      this.discount.from_date = data[0].from_date;
      this.discount.to_date = data[0].to_date;
      this.discount.discount_percentage = data[0].discount_percentage;
    }, (err) => {
    });
    i = this.discounts[i].id;
    this.discountService.getDiscountProducts(i).subscribe((data: any) => {
  
      for (var i = 0; i < data.length; i++) {
        const productone = data[i]; 
        this.products_all.push(productone);
        // this.products_one.splice(0, 1);
      }
      console.log(this.products_all);
      this.getAllProducts();
    }, (err) => {
    });

  }

  UpdateDiscount() {
    console.log(this.products_all);
    // this.registerStock();
    if (this.discount.name) {
      this.discountService.updateDiscout(this.discount).subscribe((data: any) => {
        // this.getAllSuppliers();
        this.updateStock(this.discount.id);
        // this.registerStock();
        this.notifi.success('Discount updated');

      }, (err) => {
        this.notifi.error('While inserting discout');
      });
    } else {
      this.notifi.notice('Please provide a relavant details');
    }
  }
  updateStock(i) {
    this.discountService.deleteStockProduct(i).subscribe((data: any) => {
      
      this.registerStock();

    }, (err) => {
    });


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
        sDom: 'tipr',
        fixedColumns: {
          heightMatch: 'none'
        },
        fnDrawCallback: (osSettings) => {
          this.resetTableListners();
        },
        columnDefs: [
          {
            searchable: false,
            sortable: false,
            targets: [0, 9]
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
      if ($(this).hasClass('editDiscount')) {
        // use function of current class using reference
        // _currClassRef.showValue(row.data().FirstName);

        currClassRef.viewEachDiscount(row.data()[0]);
      } else if ($(this).hasClass('deleteDiscount')) {
        currClassRef.deleteDiscount(row.data()[0]);
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
    let today = new Date();
    for (const dis of this.discounts) {

      let action='';
      let actionEnabled =
      '<button class="btn btn-mini btn-warning editDiscount"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
      '<button class="btn btn-mini btn-danger deleteDiscount"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      let actionDisabled =
      '<button class="btn btn-mini btn-warning btn btn-disabled disabled"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
      '<button class="btn btn-mini btn-danger btn-disabled disabled"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';
     



      let expired = '<label class="label label-inverse-danger">Expired</label>';
      let Ongoing = '<label class="label label-inverse-success">Ongoing</label>';
      let Upcoming = '<label class="label label-warning">Upcoming</label>';
      let disStatus = ''; 
      var fromDate = new Date(dis.from_date );
      var todate = new Date( dis.to_date);
      
      if (today > fromDate  && today >todate) {
        disStatus = expired;
        action=actionDisabled;
      } else if (today < fromDate && today < todate) {
        disStatus = Upcoming;
        action=actionEnabled;
      } else {
        disStatus = Ongoing;
        action=actionDisabled;
      }
     
      this.dataTable.row.add([dis.index, dis.id, disStatus, dis.type, dis.name, dis.discount_percentage, dis.from_date,
      dis.to_date, dis.added_date, action]);
    }
    this.dataTable.draw();
    this.resetTableListners();
  }

  /////////////////////////////////////////////////////////////// datatable related code end
}

