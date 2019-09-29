import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from './product.service';
import { NotificationsService } from 'src/app/utils/notifications';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/login/login.service';

declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit, AfterViewInit {

  dataTableLength = 5;
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
    brand_id:-1,
    size: '',
    size_id:-1,
    cloth: '',
    cloth_id:-1,
    product_description: '',
    gender: -1,
    notes: '',
    registered_date: '',
    userid: -1,
    available_qty: 0,
    alert_qty: 0,
    rating: 0, 
    status: 0
  };
product_regi={
  product:this.product,
  brand:this.brand,
  size:this.size,
  cloth:this.cloth

}
  model: NgbDateStruct;


  constructor(private loginService: LoginService,private productService: ProductService, private notifi: NotificationsService) {
  }
  ngOnInit(): void {
    this.clearProduct();
  }

  ngAfterViewInit(): void {

    this.initDataTable();
    this.getAllProducts();
    this.getAllBrands();
    this.getAllSizes();
    this.getAllCloths();
  }

  addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }
  setBrandProductName(id) {
    this.productService.getBrandName(id).subscribe((data: any) => {
      this.brand.brand_name = data[0].brand_name;
      this.product.product_description = this.brand.brand_name + " " + this.product.gender + " " + this.cloth.cloth_name;
    }, (err) => {
    }
    );
  }
  setTypeProductName() {
    this.product.product_description = this.brand.brand_name + " " + this.product.gender + " " + this.cloth.cloth_name;
  }
  setClothProductName(id) {
    this.productService.getClothName(id).subscribe((data: any) => {
      this.cloth.cloth_name = data[0].cloth_name;
      this.product.product_description = this.brand.brand_name + " " + this.product.gender + " " + this.cloth.cloth_name;
    }, (err) => {
    }
    );
  }
  getAllProducts() {
    this.products = [];
    this.productService.getAllProduct().subscribe((data: any) => {
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

  clickNewProduct() {
    this.actionMode = 'new';
    // $('#new_Customer').modal('show');
    this.clearProduct();
    $('#new_product').modal({ backdrop: 'static', keyboard: false });
  }

  getProductLastInsertId() {
    this.productService.getProductlastInsertId().subscribe((data: any) => {
      this.product.id = data[0].pid;
       
    }, (err) => {

    });
  }

  RegisterProduct() {
    this.product.userid=this.loginService.getUser().id;
    if (this.brand.id == -1 || this.size.id == 1 || this.cloth.id == -1 || this.product.gender == -1) {
      this.notifi.notice('Please select required data');
    } else {
      if (this.product.product_description) {
        this.productService.checkExistingProduct(this.product.product_description).subscribe((data: any) => {

          if (data.length < 1) {
            this.productService.insertProduct(this.product_regi).subscribe((data: any) => {
              // this.getAllProducts();
              this.notifi.success('Product registered');
              $('#new_product').modal('hide');
              this.clearProduct();
              this.getProductLastInsertId();
              this.getAllProducts();

            }, (err) => {
              this.notifi.error('While inserting product');
            }
            );
          } else {
            this.notifi.notice('Product description already exist');
          }
        }, (err) => {
          this.notifi.error('While Checking products');
        }
        );
      } else {
        this.notifi.notice('Please provide a name for the product');
      }
    }

  }
  UpdateProduct(){

    if (this.brand.id == -1 || this.size.id == 1 || this.cloth.id == -1 || this.product.gender == -1) {
      this.notifi.notice('Please select required data');
    } else {
      if (this.product.product_description) {
         
            this.productService.updateProduct(this.product_regi).subscribe((data: any) => {
              // this.getAllProducts();
              this.notifi.success('Product updated');
              $('#new_product').modal('hide');
              this.clearProduct();
              this.getAllProducts();
            }, (err) => {
              this.notifi.error('While updating product');
            }
            );
      
         
       
      } else {
        this.notifi.notice('Please provide a name for the product');
      }
    }




    
  }
  getBrandLastInsertId() {
    this.productService.getlastInsertId().subscribe((data: any) => {
      this.brand.id = data[0].bid;
    }, (err) => {

    });
  }
  RegisterBrand() {
    if (this.brand.brand_name) {
      this.productService.checkExistingBrand(this.brand.brand_name).subscribe((data: any) => {

        if (data.length < 1) {
          this.productService.insertBrand(this.brand).subscribe((data: any) => {
            // this.getAllProducts();
            this.notifi.success('Brand registered');
            this.brand.brand_name = '';
            $('#new_brand').modal('hide');
            this.getAllBrands();
            this.getBrandLastInsertId();
          }, (err) => {
            this.notifi.error('While inserting brand');
          });
        } else {
          this.notifi.error('Brand already exist');
        }
      }, (err) => {
        this.notifi.error('While checking brands');
      });


    } else {
      this.notifi.notice('Please provide a name for the brand');
    }
  }

  getAllBrands() {
    this.brands = [];
    this.productService.getAllBrands().subscribe((data: any) => {
      this.brands = data;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }
  getSizeLastInsertId() {
    this.productService.getSizelastInsertId().subscribe((data: any) => {
      this.size.id = data[0].sid;
    }, (err) => {

    });
  }
  RegisterSize() {
    if (this.size.size_name) {
      this.productService.checkExistingSize(this.size.size_name).subscribe((data: any) => {
        if (data.length < 1) {
          this.productService.insertSize(this.size).subscribe((data: any) => {
            // this.getAllProducts();
            this.notifi.success('Size registered');
            this.size.size_name = "";
            $('#new_size').modal('hide');
            this.getSizeLastInsertId();
            this.getAllSizes();
          }, (err) => {
            this.notifi.error('While inserting size');
          });

        } else {
          this.notifi.error('Size already exist');
        }
      }, (err) => {
        this.notifi.error('While checking sizes');
      });
    } else {
      this.notifi.notice('Please provide a name for the size');
    }
  }
  getAllSizes() {
    this.sizes = [];
    this.productService.getAllSizes().subscribe((data: any) => {
      this.sizes = data;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  getClothLastInsertId() {
    this.productService.getClothlastInsertId().subscribe((data: any) => {
      this.cloth.id = data[0].cid;
    }, (err) => {

    });
  }
  RegisterCloth() {
    if (this.cloth.cloth_name) {
      this.productService.checkExistingCloth(this.cloth.cloth_name).subscribe((data: any) => {
        if (data.length < 1) {
          this.productService.insertCloth(this.size).subscribe((data: any) => {
            this.notifi.success('Cloth registered');
            this.cloth.cloth_name = '';
            $('#new_cloth').modal('hide');
            this.getClothLastInsertId();
            this.getAllCloths();
          }, (err) => {
            this.notifi.error('While inserting cloth');
          }
          );
        } else {
          this.notifi.error('Cloth already exist');
        }

      }, (err) => {
        this.notifi.error('While checking Cloths');
      });


    } else {
      this.notifi.notice('Please provide a name for the cloth');
    }
  }

  getAllCloths() {
    this.cloths = [];
    this.productService.getAllCloths().subscribe((data: any) => {
      this.cloths = data;

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
    this.clearProduct();
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
          currentClass.productService.deleteProduct(this.product).subscribe((data: any) => {
              currentClass.getAllProducts();
              currentClass.notifi.success('Product Deleted');
            }, (err) => {
              currentClass.notifi.error('While Deleting Product');
            }
          );
        }
      });
   

  }
  clearProduct() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.product.product_description='';
    this.product.alert_qty=0;
    this.product.available_qty=0;
    this.product.status=0;
    this.product.notes='';
    this.brand.id=-1;
    this.product.id=-1;
    this.cloth.id=-1;
    this.size.id=-1;
    this.product.gender=-1;
  }

  viewEachProduct(i) {
    this.actionMode = 'edit';
    this.clearProduct();
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

    $('#new_product').modal({backdrop: 'static', keyboard: false});
  }

  updateProduct() {

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
              $(win.document.body).find('h1').text('Products');
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
            targets: [0, 11]
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
    for (const pro of this.products) {

      let discount_action='<button class="btn btn-mini btn-success adddiscount"> Discount</button>'
      let action = 
        '<button class="btn btn-mini btn-warning editProduct"> <i class="icofont icofont-edit-alt" aria-hidden="true"></i></button> ' +
        '<button class="btn btn-mini btn-danger deleteProduct"> <i class="icofont icofont-ui-delete" aria-hidden="true"></i></button>';

      this.dataTable.row.add([pro.index, pro.id, pro.brand, pro.size, pro.cloth, pro.product_description,
      pro.gender, pro.notes, pro.available_qty,pro.alert_qty, pro.registered_date,action]);
      // this.dataTable.row.add([pro.index, pro.id, pro.brand, pro.size, pro.cloth, pro.product_description,
      //   pro.gender, pro.notes, pro.registered_date, pro.alert_qty,  pro.rating, action]);
      
    var table = $('#mytable').DataTable(); 
    console.log(pro);
    
    if(Number(pro.available_qty)<=Number(pro.alert_qty)){
      console.log(Number(pro.available_qty)+"==="+Number(pro.alert_qty));
      $( table.column( 5)).addClass( 'highlight2' );
      $( table.column( 8) ).addClass( 'highlight2' );
    }else{
      $( table.column( 5).nodes() ).removeClass( 'highlight2' );
      $( table.column( 8).nodes() ).removeClass( 'highlight2' );
    }
   
    }

    this.dataTable.draw();
    this.resetTableListners();
   
      }

  /////////////////////////////////////////////////////////////// datatable related code end
}

