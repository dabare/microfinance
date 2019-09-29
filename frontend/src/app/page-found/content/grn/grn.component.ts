import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../supplier/supplier.service';
import { NotificationsService } from 'src/app/utils/notifications';

import Swal from 'sweetalert2';
import { ProductService } from '../product/product.service';
import { GRNService } from './grn.service';
import { CurrencyPipe } from '@angular/common';
import { LoginService } from 'src/app/login/login.service';
import { parse } from 'url';

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GRNComponent implements OnInit {
  suppliers: any[] = [];
  supplier = {
    id: -1,
    name: '',
    contactNo1: '',
    contactNo2: '',
    address: '',
    rating: '',
    email: '',
    registered_date: '',
    userid: -1
  };
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

  actionMode = 'new';
  file = 'supplier_invoice.odt';
  brands: any[] = [];
  paymentTypes: any[] = [];
  cloths: any[] = [];
  sizes: any[] = [];
  products: any[] = [];
  products_one: Array<any> = [];
  products_all: Array<any> = [];
  stock: any[] = [];
  product = {
    id: -1,
    product_description: '',
    available_qty: 0,
    grn_id: -1,
    product_id: -1,
    qty: 0,
    buying_price:0.00,
    selling_price: 0.00,
    profit_percentage: 0,
    status: 1,
    total: 0.00,
    total_p: '0.00',
    subtotal: 0.00,
    discount: 0.00,
    discount_p:'0.00',
    payable: 0.00,
    paid_amount: 0.00,
    paid_amount_p: '0.00',
    balance:0.00,
    balance_p:'0.00',
    due_amount: 0.00,
    due_amount_p: '0.00',
    userid: -1,
    notes: '',
    total_qty: 0,
    gender: -1,
    alert_qty: 0
  };
  paymentType = {
    id: -1,
    type: '',
    status: ''
  }
  grn = {
    id: -1,
    ref_no: '',
    supplier_id: -1,
    payment_type_grn_id: -1,
    total_qty: 0,
    total: 0.00,
    userid: -1,
    notes: '',
    status: 1,
    invoice_issueddate: ''
  }
  grn_regi = {
    date_grn: '',
    product: this.product,
    supplier: this.supplier,
    paymentType: this.paymentType,
    grn: this.grn
  }
  product_regi = {
    product: this.product,
    brand: this.brand,
    size: this.size,
    cloth: this.cloth

  }
  editField: string;
  data = {
    grn_regi: this.grn_regi,
    products_all: this.products_all
  }
  printObjects = {
    printer: "",
    file: this.file,
    data: this.data
  }

  constructor(private loginService: LoginService,private cp: CurrencyPipe, private grnService: GRNService, private supplierService: SupplierService, private productService: ProductService, private notifi: NotificationsService) {

  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    this.getAllSuppliers();
    this.getAllProducts();
    this.getAllBrands();
    this.getAllSizes();
    this.getAllCloths();
    this.getAllPaymentTypeGRN();
    this.getNewGRNId();
    this.setPaymentType(1);
    this.validateFields();
  }

  validateFields() {
    $("#contactno1").on("keypress keyup blur", function (event) {
      $(this).val($(this).val().replace(/[^\d].+/, ""));

      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }
    });
    $("#contactno2").on("keypress keyup blur", function (event) {
      $(this).val($(this).val().replace(/[^\d].+/, ""));
      if ((event.which < 48 || event.which > 57)) {
        event.preventDefault();
      }
    });

  }
  getAllProducts() {

    this.products = [];
    this.productService.getAllProduct().subscribe((data: any) => {
      this.products = data;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  getNewGRNId() {
    this.cloths = [];
    this.grnService.getNewGRNId().subscribe((data: any) => {
      console.log(data);
      this.grn.id = Number(data[0].id) + 1;

    }, (err) => {
      // this.datatable.clear();
      // this.datatable.rows.add(this.doctors);
      // this.datatable.draw();
      // toastr.error('While fetching doctor details', 'Data fetch error');
    }
    );
  }

  getAllSuppliers() {
    this.suppliers = [];
    this.supplierService.getAllSuppliers().subscribe((data: any) => {
      this.suppliers = data;

    }, (err) => {

    }
    );
  }

  setSupplier(sid) {
    this.supplierService.getSupplierName(sid).subscribe((data: any) => {
      this.supplier.id = data[0].id;
      this.supplier.name = data[0].name;
    }, (err) => {

    }
    );

  }
  setPaymentType(pid) {
    this.grnService.getAllPaymentTypName(pid).subscribe((data: any) => {

      this.paymentType.type = data[0].type;
    }, (err) => {

    }
    );

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
  clearSupplier() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.supplier.id = -1;
    this.supplier.name = '';
    this.supplier.contactNo1 = '';
    this.supplier.contactNo2 = '';
    this.supplier.address = '';
    this.supplier.email = '';
    this.supplier.rating = '0';
    this.supplier.registered_date = mm + '/' + dd + '/' + yyyy;
    this.supplier.userid = -1;

  }

  getSupLastInsertId() {
    this.supplierService.getlastInsertId().subscribe((data: any) => {
      this.supplier.id = data[0].sid;
    }, (err) => {

    });
  }
  validateEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  RegisterSupplier() {
    this.supplier.userid=this.loginService.getUser().id;
    if (this.supplier.name) {
      if (this.supplier.contactNo1 || this.supplier.contactNo2) {
        console.log(this.supplier.email);
        if (this.supplier.email == '' || this.validateEmail(this.supplier.email)) {
          this.supplierService.insertSupplier(this.supplier).subscribe((data: any) => {
            this.getAllSuppliers();
            this.getSupLastInsertId();
            this.notifi.success('Supplier registered');
            $('#new_supplier').modal('hide');
            this.clearSupplier();
          }, (err) => {
            this.notifi.error('While inserting supplier');
          }
          );
        } else {
          this.notifi.notice('Please provide a valid email address');
        }
      } else {
        this.notifi.notice('Please provide a phone number for the supplier');
      }
    } else {
      this.notifi.notice('Please provide a name for the supplier');
    }
  }

  getProductLastInsertId() {
    this.productService.getProductlastInsertId().subscribe((data: any) => {
      this.product.id = data[0].pid;
      this.AddRow(this.product.id);
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
  // UpdateProduct() {
  //   if (this.product.product_description) {

  //     this.productService.updateProduct(this.product_regi).subscribe((data: any) => {
  //       // this.getAllProducts();
  //       this.notifi.success('Product registered');
  //       $('#new_product').modal('hide');
  //       this.getAllProducts();
  //     }, (err) => {
  //       this.notifi.error('While inserting product');
  //     }
  //     );

  //   } else {
  //     this.notifi.notice('Please provide a name for the product');
  //   }
  // }
  checkExistingBrand(brand_name) {
    this.productService.checkExistingBrand(brand_name).subscribe((data: any) => {
      if (data.length < 1) {
        this.notifi.error('Brand already exist');
        return false;
      } else {
        return true;
      }
    }, (err) => {
      this.notifi.error('While checking brands');
    });

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

  getAllPaymentTypeGRN() {
    this.paymentTypes = [];
    this.grnService.getAllPaymentTypeGRN().subscribe((data: any) => {
      this.paymentTypes = data;

    }, (err) => {
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
  clearProduct() {

    this.product.product_description = '';
    this.product.available_qty = 0;
    this.product.status = 1;
    this.brand.id = -1;
    this.product.id = -1;
    this.cloth.id = -1;
    this.size.id = -1;
    this.product.gender = -1;
    this.product.notes = '';
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

  AddRow(i) {
    this.productService.getProductDetail(i).subscribe((data: any) => {
      data[0].qty = 0;
      data[0].buying_price ='0.00';
      data[0].selling_price ='0.00';
      data[0].total = '0';
      data[0].buying_price_p = '0.00';
      data[0].selling_price_p = '0.00';
      data[0].total_p = '0.00';
      data[0].sellingPercentage = 0;
      data[0].grn_id = this.grn.id;
      this.products_one = data;

      const productone = this.products_one[0];
      this.products_all.push(productone);
      console.log(this.products_all);
      this.products_one.splice(0, 1);

    }, (err) => {
    }
    );

  }

  calculateRowTotal(i: number) {
    var tot = 0.0;
    var tot_qty = 0;
    for (var x = 0; x < this.products_all.length; x++) {
      tot += this.products_all[x].total;
      tot_qty = this.products_all[x].qty;
    }
    this.product.total_qty = tot_qty;

    this.product.subtotal = (tot - this.products_all[i].total) + this.products_all[i].buying_price * this.products_all[i].qty;
    this.products_all[i].total = this.products_all[i].buying_price * this.products_all[i].qty 
    this.product.total = this.product.subtotal;


    this.products_all[i].sellingPercentage = ((this.products_all[i].selling_price - this.products_all[i].buying_price) / this.products_all[i].selling_price) * 100;
    this.product.total = this.product.total - this.product.discount;
    this.product.balance = this.product.paid_amount - this.product.total;
    if (this.product.balance > 0) {
      this.product.due_amount = 0.00;

    } else {
      this.product.due_amount = Math.abs(this.product.balance);
    }
  }
  calculateSellingPercentage(i: number) {
    this.products_all[i].sellingPercentage = ((this.products_all[i].selling_price - this.products_all[i].buying_price) / this.products_all[i].selling_price) * 100
  }
  removeRow(id: any) {
    this.products_one.push(this.products_all[id]);
    this.products_all.splice(id, 1);
  }
  calculateTotalPayable() {
    this.product.total = this.product.total - this.product.discount;
    this.product.balance = this.product.paid_amount - this.product.total;
    if (this.product.balance > 0) {
      this.product.due_amount = 0.00;

    } else {
      this.product.due_amount = Math.abs(this.product.balance);
    }
  }

  calculateBalance() {
    this.product.total = this.product.total - this.product.discount;
    this.product.balance = this.product.paid_amount - this.product.total;
    if (this.product.balance > 0) {
      this.product.due_amount = 0.00;

    } else {
      this.product.due_amount = Math.abs(this.product.balance);
    }
  }

  clearGRN() {
    this.products_all.length = 0;
    this.supplier.id = -1;
    this.grn.invoice_issueddate = '';
    this.grn.ref_no = '';
    this.getNewGRNId();
    this.product.id = -1;
    this.grn.notes = '';
    this.product.subtotal = 0.00;
    this.paymentType.id = -1;
    this.product.discount = 0.00;
    this.product.total = 0.00;
    this.product.paid_amount = 0.00;
    this.product.due_amount = 0.00;
    this.product.balance = 0.00
  }
  validateGRN() {
    if (this.supplier.id == -1 || this.grn.invoice_issueddate == '' || this.grn.ref_no == '' || this.products_all.length == 0|| (this.product.due_amount==0 && this.product.paid_amount==0)) {
      return false;

    }else if(this.paymentType.id==-1){ 
      return false;
    } else {
      return true;
    }
    
  }
  registerGRN() {  
    this.product.userid=this.loginService.getUser().id;
    if (this.validateGRN()) {
      this.grnService.insertGRN(this.grn_regi).subscribe((data: any) => {
        this.notifi.success('GRN added'); 
        this.registerStock();
        this.updateProductAvailableQty();
        // this.print();
        this.clearGRN();
      }, (err) => {
        this.notifi.error('While inserting GRN');
      }
      );

    } else {
      this.notifi.error('Please fill required data');
    }

  }

  updateProductAvailableQty() {
    for (var x = 0; x < this.products_all.length; x++) {
      this.stock = this.products_all[x];
      this.grnService.updateProductAvailableQty(this.stock).subscribe((data: any) => {
        // this.notifi.success('Update stock');
        // this.clearGRN();

      }, (err) => {
        this.notifi.error('While inserting GRN');
      }
      );
    }

  }
  registerStock() {
    for (var x = 0; x < this.products_all.length; x++) {
      this.stock = this.products_all[x];
      this.grnService.insertStock(this.stock).subscribe((data: any) => {
        // this.notifi.success('Stock added');
        // this.clearGRN();

      }, (err) => {
        this.notifi.error('While inserting GRN');
      }
      );
    }


  }
  // date_grn: d2 + " " + d,
  // inv_id: req.body.grn_regi.grn.ref_no,
  // supplier_name: req.body.grn_regi.supplier.name,
  // payment_status: req.body.grn_regi.paymentType.id,
  // datarow: [
  //     { "product_description": req.body.products_all.product_description },
  //     { "price": req.body.products_all.buying_price },
  //     { "qty": req.body.products_all.qty },
  //     { "subtotal": req.body.products_all.total },
  // ],
  // total_grn: req.body.grn_regi.product.total,
  // payment_type: req.body.grn_regi.paymentType.type,
  // discount: req.body.grn_regi.product.discount,
  // paid_amount: req.body.grn_regi.product.paid_amount,
  // due_amount: req.body.grn_regi.product.due_amount,
  print() { 
    
    this.product.total_p=parseFloat(this.product.total.toString()).toFixed(2);
    this.product.discount_p=parseFloat(this.product.discount.toString()).toFixed(2);
    this.product.paid_amount_p=parseFloat(this.product.paid_amount.toString()).toFixed(2);
    this.product.balance_p=parseFloat(this.product.balance.toString()).toFixed(2);
    this.product.due_amount_p=parseFloat(this.product.due_amount.toString()).toFixed(2);

    for (var x = 0; x < this.products_all.length; x++) {
       this.products_all[x].total=parseFloat( this.products_all[x].total).toFixed(2);
       this.products_all[x].buying_price=parseFloat( this.products_all[x].buying_price).toFixed(2);
    }


    var d = new Date().toLocaleTimeString().replace(/ T/, ' ').replace(/\..+/, '');
    var d2 = new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    this.grn_regi.date_grn = d2 + " " + d;
    this.grnService.printGRN(this.printObjects).subscribe((data: any) => {
      this.notifi.success("Printing.....!");

    }, (err) => {
      console.log(err);
      this.notifi.error("Error while printing", "Please try again!");
    });
  }
}
