import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2, ViewChild
} from '@angular/core';
import {InvoiceService} from './invoice.service';
import {NotificationsService} from '../../../utils/notifications';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import {LeftNavBarService} from '../../left-nav-bar/left-nav-bar.service';

declare var $: any;

interface InvoiceProduct {
  id: string;
  invoice_id: string;
  stock_id: string;
  qty: number;
  price: number;
  amount: number;
  product_description: string;
}

@Component({
  selector: 'app-tables',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})

export class InvoiceComponent implements OnInit, AfterViewInit {

  statusInfo = {
    0: {Status: 'Deleted', Style: 'badge-primary'},
    1: {Status: 'Paid', Style: 'badge-success'},
    3: {Status: 'Pending', Style: 'badge-info'},
    4: {Status: 'Cancelled', Style: 'badge-danger'},
    new: {Status: 'New', Style: 'badge-warning'},
  };
  inputMode = 'product';
  customer = {
    id: -1,
    name: '',
    contactNo1: '-',
    contactNo2: '-',
    address: '-',
    email: '-',
    dob: '',
    points: 0,
    registered_date: '',
    userid: -1
  };
  invoices: any[] = [];
  currentInvoice = 0;
  selectInvoiceCustomer: any;
  customers: any[] = [];
  selectCustomers: any[] = [];
  paymentMethods: any[] = [];
  products: any[] = [];
  selectProducts: any[] = [];
  productCode = '';
  invoiceProducts: InvoiceProduct[] = [];
  invoice = {
    id: '',
    customer_id: '1', // default
    payment_type_invoice_id: '-1',
    payment_type_name: '',
    qty: '0',
    discount: '0',
    total: 0,
    issued_date: '',
    issued_time: '',
    return: '0',
    gift: '0',
    userid: '-1',
    status: '3',
    paid_amount: 0,
    gross_amount: '0',
    balance: 0
  };
  supplier = {
    id: -1,
    rating: 0
  };
  data = {
    invoice: this.invoice,
  };
  @ViewChild('invoiceProductCode', {static: false}) invoiceProductCodeElement: ElementRef;
  @ViewChild('invoicePaidAmount', {static: false}) invoicePaidAmountElement: ElementRef;
  @ViewChild('invoiceDiscount', {static: false}) invoiceDiscountElement: ElementRef;

  constructor(private invoiceService: InvoiceService, private notifi: NotificationsService,
              private router: Router, private leftNavBarComponent: LeftNavBarService, private renderer: Renderer2) {
  }

  clearInvoice() {
    this.invoice.id = '';
    this.invoice.customer_id = '1';
    this.invoice.payment_type_invoice_id = '-1';
    this.invoice.qty = '0';
    this.invoice.discount = '0';
    this.invoice.total = 0;
    this.setInvoiceTime(null);
    this.invoice.return = '0';
    this.invoice.gift = '0';
    this.invoice.userid = '-1';
    this.invoice.status = '3';
    this.invoice.paid_amount = 0;
    this.invoice.gross_amount = '0';
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F2':
        this.clickReturn();
        return;
      case 'F4':
        this.clickNewINvoice();
        return;
      case 'ArrowLeft':
        this.gotoPreviousInvoice();
        return;
      case 'ArrowRight':
        this.gotoNextInvoice();
        return;
    }
  }

  ngOnInit() {
    this.clearInvoice();
  }

  prepareDataForSelectCustomer(array: any[]) {
    this.selectCustomers = [];
    for (let index = 0; index < array.length; index++) {

      const phone = [];

      if (array[index].contactNo1.trim() && array[index].contactNo1.trim() !== '-') {
        phone.push(array[index].contactNo1.trim());
      }
      if (array[index].contactNo2.trim() && array[index].contactNo2.trim() !== '-') {
        phone.push(array[index].contactNo2.trim());
      }

      const tmp = {
        id: index,
        text: phone.join(',') + ' - ' + array[index].name
      };

      this.selectCustomers.push(tmp);
    }
  }

  prepareDataForSelectProduct(array: any[]) {
    this.selectProducts = [];
    for (const item of array) {
      this.selectProducts.push(item.id + ':-' + item.product_description);
    }
  }

  setInvoiceTime(time) {
    if (time) {
      this.invoice.issued_date = new Date(time).toLocaleString();
    } else {
      this.invoice.issued_date = new Date().toLocaleString();
    }
  }

  getPaymentMethods() {
    this.paymentMethods = [];
    this.invoiceService.getPaymentTypesInvoice().subscribe((data: any) => {
        this.paymentMethods = data;
      }, (err) => {
        this.notifi.error('While fetching payment details');
      }
    );
  }

  getProducts() {
    this.products = [];
    this.invoiceService.getInvoiceProducts().subscribe((data: any) => {
        this.products = data;
        this.prepareDataForSelectProduct(this.products);
      }, (err) => {
        this.notifi.error('While fetching product details');
      }
    );
  }

  getAllCustomers(setSelection) {
    this.customers = [];
    this.invoiceService.getAllCustomers().subscribe((data: any) => {
        this.customers = data;
        this.prepareDataForSelectCustomer(this.customers);
        if (setSelection) {
          this.invoice.customer_id = setSelection;
          this.initSelectCustomer(this.customers.findIndex(x => x.id === setSelection));
        } else {
          this.initSelectCustomer(0);
        }
      }, (err) => {
        this.notifi.error('While fetching customer details');
      }
    );
  }

  customerSelected(i) {
    this.invoice.customer_id = this.customers[i].id;
    this.setInvoiceTime(null);
    if (this.invoice.status === '3') {
      this.invoiceService.updateInvoiceCustomer(this.invoice).subscribe((data: any) => {
        }, (err) => {
          this.notifi.error('While updating customer');
        }
      );
    } else {
      this.notifi.info('Cannot update the customer of an issued or cancelled invoice');
    }
  }

  paymentMethodSelected() {
    if (this.invoice.status === '3') {
      this.invoice.payment_type_invoice_id = $('#invoicePaymentMethod').val();
      this.invoice.payment_type_name = $('#invoicePaymentMethod option:selected').text();
      this.invoiceService.updateInvoicePaymentMethod(this.invoice).subscribe((data: any) => {
        }, (err) => {
          this.notifi.error('While updating payment method');
        }
      );
    } else {
      this.notifi.info('Cannot update the payment method of an issued or cancelled invoice');
    }
  }

  searchProducts = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.trim().length > 0 && term.trim()[0] === '#' ?
        this.selectProducts.filter(v => v.toLowerCase().indexOf(term.toLowerCase().substr(1, term.length)) > -1).slice(0, 10) : [])
    )


  getAllInvoiceProducts() {
    this.invoiceProducts = [];
    this.invoiceService.getProductsOfAnInvoice(this.invoice).subscribe((data: any) => {
        this.invoiceProducts = data;
        this.updateInvoiceDetails();
      }, (err) => {
        this.notifi.error('While fetching invoice products');
      }
    );
  }

  // updates amount total item count etc.
  updateInvoiceDetails() {
    let qty = 0;
    let total = 0;
    for (const product of this.invoiceProducts) {
      qty += Number(product.qty);
      total += Number(product.amount);
    }
    this.invoice.qty = qty + '';
    this.invoice.gross_amount = total + '';
    this.invoice.total = total - Number(this.invoice.discount);

    this.invoiceService.updateInvoice(this.invoice).subscribe((data: any) => {
      }, (err) => {
        this.notifi.error('While fetching updating invoice');
      }
    );
  }

  // get productsn whos qty is > 0
  getValidProducts() {
    return this.invoiceProducts.filter(x => x.qty > 0);
  }

  loadInvoice() {
    this.clearInvoice();
    this.invoiceProducts = [];
    this.getAllInvoiceProducts();
    this.getAllCustomers(null);
    this.setInvoiceTime('');
    this.getTodayInvoices(true);
  }

  clickNewINvoice() {
    this.clearInvoice();
    this.invoiceProducts = [];
    this.getAllInvoiceProducts();
    this.getAllCustomers(null);
    this.setInvoiceTime('');
    this.getTodayInvoices(false);
  }

  cancleInvoice() {
    const currentClass = this;
    if (this.invoice.id !== '') {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Cancle Invoice ' + this.invoice.id,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-danger',
        confirmButtonText: 'Yes, cancle!',
        cancelButtonText: 'No'
      }).then(
        (willDelete) => {
          if (willDelete.value) {
            this.invoiceService.cancleInvoice(this.invoice).subscribe((data: any) => {
                // for (const product of this.invoiceProducts) {
                //
                //   if (this.invoice.status === '1') {
                //     this.invoiceService.getStockInHand(product.stock_id).subscribe((dataa: any) => {
                //         const prod = {
                //           id: product.stock_id,
                //           available_qty: Number(dataa[0].available_qty) + Number(product.qty)
                //         };
                //         this.invoiceService.updateStockQty(prod).subscribe((dataaa: any) => {
                //           }, (err) => {
                //             this.notifi.error('While updating stocks');
                //           }
                //         );
                //       }, (err) => {
                //         this.notifi.error('While updating stocks');
                //       }
                //     );
                //     }
                //
                // }
                this.loadInvoice();
              }, (err) => {
                this.notifi.error('While cancelling invoice');
              }
            );
          }
        });
    }
  }


  print() {
    this.data = {
      invoice: this.invoice,
    };
    this.invoice.balance = this.invoice.paid_amount = this.invoice.total;

    const d = new Date().toLocaleTimeString().replace(/ T/, ' ').replace(/\..+/, '');
    const d2 = new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    this.invoice.issued_date = d2;
    this.invoice.issued_time = d;
    this.invoiceService.printInvoice(this.data).subscribe((data: any) => {
      this.notifi.success('Printing invoice...');

    }, (err) => {
      console.log(err);
      this.notifi.error('Error while printing', 'Please try again!');
    });
  }

  clickDone() {

    this.invoice.payment_type_invoice_id = $('#invoicePaymentMethod').val();
    // for (const product of this.invoiceProducts) {
    //   const stockProduct = this.products.filter(x => x.id === product.stock_id)[0];
    //   stockProduct.available_qty = Number(stockProduct.available_qty) - Number(product.qty);
    //   this.invoiceService.updateStockQty(stockProduct).subscribe((data: any) => {
    //     }, (err) => {
    //       this.notifi.error('While updating stocks');
    //     }
    //   );
    // }

    this.print();
    this.invoiceService.updatePaiedInvoice(this.invoice).subscribe((data: any) => {
        // this.notifi.success('Printing invoice');
      }, (err) => {
        this.notifi.error('While issuing invoice');
      }
    );
    this.loadInvoice();
  }

  removeProductFromINvoice(index) {
    const product = this.getValidProducts()[index];
    product.qty--;
    product.amount -= product.price;
    this.invoiceService.updateProductOfAnInvoice(product).subscribe((data: any) => {
        this.getAllInvoiceProducts();
      }, (err) => {
        this.notifi.error('While fetching invoice products');
      }
    );
  }

  productEntered() {
    if (this.selectProducts.filter(x => x.toLowerCase().indexOf(this.productCode.toLowerCase()) > -1).length > 0) {
      const id = this.productCode.trim().split(':-')[0].trim();
      const filteredProducts = this.products.filter(x => x.id === id);
      if (filteredProducts.length > 0) {
        // chcek is the product is already in the invoice product list
        // const alreadyAddedProduct = this.invoiceProducts.filter(x => x.stock_id.trim() === id);
        // if (alreadyAddedProduct.length > 0) {
        //   alreadyAddedProduct[0].qty++;
        //   alreadyAddedProduct[0].amount = alreadyAddedProduct[0].price * alreadyAddedProduct[0].qty;
        //   this.invoiceService.updateProductOfAnInvoice(alreadyAddedProduct[0]).subscribe((data: any) => {
        //       this.getAllInvoiceProducts();
        //     }, (err) => {
        //       this.notifi.error('While updating invoice products');
        //     }
        //   );
        // } else {
        const product: InvoiceProduct = {
          id: '',
          stock_id: id,
          qty: 1,
          price: filteredProducts[0].selling_price,
          amount: filteredProducts[0].selling_price,
          product_description: filteredProducts[0].product_description,
          invoice_id: this.invoice.id,
        };
        this.invoiceService.addProductToInvoice(product).subscribe((data: any) => {
            this.getAllInvoiceProducts();
          }, (err) => {
            this.notifi.error('While adding new product');
          }
        );
        // }
      } else {
        this.notifi.info('Invalid Product Selected');
      }
    } else {
      if (this.productCode.substr(0, 1) !== '#') {
        this.notifi.info('Invalid Product Selected');
      }
    }
    this.productCode = '';
  }

  checkNewInvoiceOrPendidngInvoice(createManyPendingInvoices) {
    if (this.invoices.length === 0) {
// generate a new invoice
      this.invoiceService.newInvoice(this.invoice).subscribe((dataa: any) => {
          this.getTodayInvoices(true);
        }, (err) => {
          this.notifi.error('While creating invoice');
        }
      );
    } else {
      this.invoiceService.getInvoice(this.invoices[this.invoices.length - 1].id).subscribe((data: any) => {
          data = data[0];
          if (data.status === '3' && !createManyPendingInvoices) {
            this.currentInvoice = this.invoices.length - 1;
            this.getInvoice();
          } else if (data.status === '3' && createManyPendingInvoices) {
            this.invoiceService.getProductsOfAnInvoice({id: data.id}).subscribe((dataa: any) => {
                if (dataa.length > 0) {
                  this.invoiceService.newInvoice(this.invoice).subscribe((dataaa: any) => {
                      this.getTodayInvoices(true);
                    }, (err) => {
                      this.notifi.error('While creating invoice');
                    }
                  );
                } else {
                  this.getTodayInvoices(true);
                }
              }, (err) => {
                this.notifi.error('While fetching invoice products');
              }
            );
          } else if (data.status !== '3') {
            // generate a new invoice
            this.invoiceService.newInvoice(this.invoice).subscribe((dataa: any) => {
                this.getTodayInvoices(true);
              }, (err) => {
                this.notifi.error('While creating invoice');
              }
            );
          }
        }, (err) => {
          this.notifi.error('While fetching invoices');
        }
      );
    }
  }

  getTodayInvoices(checkNewInvoiceOrPendidngInvoice) {
    this.invoiceService.getTodayInvoices().subscribe((data: any) => {
        this.invoices = data;
        if (checkNewInvoiceOrPendidngInvoice) {
          this.checkNewInvoiceOrPendidngInvoice(false);
        } else {
          this.checkNewInvoiceOrPendidngInvoice(true);
        }
      }, (err) => {
        this.notifi.error('While fetching invoices');
      }
    );
  }

  getInvoice() {
    this.invoiceService.getInvoice(this.invoices[this.currentInvoice].id).subscribe((data: any) => {
        this.clearInvoice();
        data = data[0];
        this.invoice.id = data.id;
        this.invoice.customer_id = data.customer_id;
        this.invoice.payment_type_invoice_id = data.payment_type_invoice_id;
        this.invoice.qty = data.qty;
        this.invoice.discount = data.discount;
        this.invoice.total = data.total;
        this.setInvoiceTime(data.issued_date);
        this.invoice.return = data.return;
        this.invoice.gift = data.gift;
        this.invoice.userid = data.userid;
        this.invoice.status = data.status;
        this.invoice.paid_amount = data.paid_amount;
        this.invoice.gross_amount = data.gross_amount;
        this.getAllInvoiceProducts();
        this.selectCustomer(this.customers.findIndex(x => x.id === data.customer_id));
        $('#invoicePaymentMethod').val(data.payment_type_invoice_id);
      }, (err) => {
        this.notifi.error('While fetching invoices');
      }
    );
  }

  gotoFirstInvoice() {
    this.currentInvoice = 0;
    this.getInvoice();
  }

  gotoLatestInvoice() {
    this.currentInvoice = this.invoices.length - 1;
    this.getInvoice();
  }

  gotoPreviousInvoice() {
    if (this.currentInvoice > 0) {
      this.currentInvoice--;
      this.getInvoice();
    }
  }

  gotoNextInvoice() {
    if (this.currentInvoice < this.invoices.length - 1) {
      this.currentInvoice++;
      this.getInvoice();
    }
  }

  initSelectCustomer(setSelected) {
    const currentClass = this;
    if (!this.selectInvoiceCustomer) {
      this.selectInvoiceCustomer = $('#selectInvoiceCustomer');
      this.selectInvoiceCustomer.select2({
        // theme: 'classic',
        data: currentClass.selectCustomers
      }).on('select2:select', (e) => {
        currentClass.customerSelected(e.params.data.id);
      });
    }

    if (setSelected != null || setSelected !== '') {
      this.selectInvoiceCustomer.select2({
        // theme: 'classic',
        data: currentClass.selectCustomers
      });
      this.selectCustomer(setSelected);
    }
  }

  selectCustomer(index) {
    this.selectInvoiceCustomer.val(this.selectCustomers[index].id).trigger('change');
  }

  clickNewCustomer() {
    this.clearCustomer();
    $('#new_Customer').modal({backdrop: 'static', keyboard: false});
  }

  clearCustomer() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    this.customer.id = -1;
    this.customer.name = '';
    this.customer.contactNo1 = '';
    this.customer.contactNo2 = '';
    this.customer.address = '';
    this.customer.email = '';
    this.customer.dob = '2012-12-12';
    this.customer.points = 0;
    this.customer.registered_date = mm + '/' + dd + '/' + yyyy;
    this.customer.userid = -1;

  }

  setNewlyInsertedCustomer() {
    this.customers = [];
    this.invoiceService.getNewCustomerId().subscribe((data: any) => {
        this.getAllCustomers(data[0].id);
      }, (err) => {
        this.notifi.error('While fetching customer details');
      }
    );
  }

  clickRegisterCustomer() {
    if (this.customer.name) {
      if (this.customer.contactNo1 || this.customer.contactNo2) {
        this.invoiceService.insertCustomer(this.customer).subscribe((data: any) => {
            this.setNewlyInsertedCustomer();
            this.notifi.success('Customer inserted');
            $('#new_Customer').modal('hide');
          }, (err) => {
            this.notifi.error('While inserting customer');
          }
        );
      } else {
        this.notifi.notice('Please provide a phone number for the customer');
      }
    } else {
      this.notifi.notice('Please provide a name for the customer');
    }
  }

  changeDiscount() {
    this.invoice.total = Number(this.invoice.gross_amount) - Number(this.invoice.discount);
  }

  clickReturn() {
    this.router.navigateByUrl('/app/sales-return');
    this.leftNavBarComponent.clickLink('#invoice');
    // this.leftNavBarComponent.clickLink('#sales-return');
  }

  tabPressedProductSelection() {
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.invoiceDiscountElement.nativeElement.focus();
    }, 0);
  }

  tabPressedPaidAmount() {
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.invoiceProductCodeElement.nativeElement.focus();
    }, 0);
  }

  tabPressedDiscount() {
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.invoicePaidAmountElement.nativeElement.focus();
    }, 0);
  }

  ngAfterViewInit(): void {
    this.getPaymentMethods();
    this.getProducts();
    this.loadInvoice();
  }
}

/// to do
// print invoice
// retun title set when go to return page
// check stock in hand when cancleing a pending invoice
