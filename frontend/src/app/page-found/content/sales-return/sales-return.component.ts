import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {NotificationsService} from '../../../utils/notifications';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import Swal from 'sweetalert2';
import {SalesReturnService} from './sales-return.service';
import {LeftNavBarService} from '../../left-nav-bar/left-nav-bar.service';

declare var $: any;

interface ReturnProduct {
  id: string;
  sales_return_id: string;
  stock_id: string;
  qty: number;
  product_description: string;
  selling_price: number;
  amount: number;
}

@Component({
  selector: 'app-tables',
  templateUrl: './sales-return.component.html',
  styleUrls: ['./sales-return.component.scss']
})
export class SalesReturnComponent implements OnInit, AfterViewInit {

  constructor(private salesReturnService: SalesReturnService, private notifi: NotificationsService, private router: Router, private leftNavBarComponent: LeftNavBarService) {
  }

  statusInfo = {
    0: {Status: 'Deleted', Style: 'badge-primary'},
    1: {Status: 'Ticket Issued', Style: 'badge-success'},
    3: {Status: 'Pending', Style: 'badge-info'},
    4: {Status: 'Cancelled', Style: 'badge-danger'},
    new: {Status: 'New', Style: 'badge-warning'},
  };

  returns: any[] = [];
  currentReturn = 0;
  return = {
    id: '',
    status: '3',
    issued_date: '',
    total: '0',
  };

  returnProducts: ReturnProduct [] = [];

  products: any[] = [];
  selectProducts: any[] = [];
  productCode = '';

  clearReturn() {
    this.return.id = '';
    this.return.status = '3';
    this.return.issued_date = '';
    this.return.total = '0';
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'F2':
        this.clickInvoice();
        return;
      case 'F4':
        this.clickNewReturn();
        return;
      case 'ArrowLeft':
        this.gotoPreviousReturn();
        return;
      case 'ArrowRight':
        this.gotoNextReturn();
        return;
    }
  }

  ngOnInit() {
    this.clearReturn();
  }

  prepareDataForSelectProduct(array: any[]) {
    this.selectProducts = [];
    for (const item of array) {
      this.selectProducts.push(item.id + ':-' + item.product_description);
    }
  }

  setReturnTime(time) {
    if (time) {
      this.return.issued_date = new Date(time).toLocaleString();
    } else {
      this.return.issued_date = new Date().toLocaleString();
    }
  }

  getProducts() {
    this.products = [];
    this.salesReturnService.getReturnProducts().subscribe((data: any) => {
        this.products = data;
        this.prepareDataForSelectProduct(this.products);
      }, (err) => {
        this.notifi.error('While fetching product details');
      }
    );
  }

  searchProducts = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.trim().length > 0 && term.trim()[0] === '#' ?
        this.selectProducts.filter(v => v.toLowerCase().indexOf(term.toLowerCase().substr(1, term.length)) > -1).slice(0, 10) : [])
    )


  getAllReturnProducts() {
    this.returnProducts = [];
    this.salesReturnService.getProductsOfAReturn(this.return).subscribe((data: any) => {
      this.returnProducts = data;
      this.updateReturnDetails();
      }, (err) => {
      this.notifi.error('While fetching return products');
      }
    );
  }

  // updates amount total item count etc.
  updateReturnDetails() {
    let qty = 0;
    let total = 0;
    for (const product of this.returnProducts) {
      qty += Number(product.qty);
      total += Number(product.amount);
    }
    // this.return.qty = qty + '';
    this.return.total = total + '';

    this.salesReturnService.updateReturn(this.return).subscribe((data: any) => {
      }, (err) => {
      this.notifi.error('While updating return');
      }
    );
  }

  // get productsn whos qty is > 0
  getValidProducts() {
    return this.returnProducts.filter(x => x.qty > 0);
  }

  loadReturn() {
    this.clearReturn();
    this.returnProducts = [];
    this.getAllReturnProducts();
    this.setReturnTime('');
    this.getTodayReturns(true);
  }

  clickNewReturn() {
    this.clearReturn();
    this.returnProducts = [];
    this.getAllReturnProducts();
    this.setReturnTime('');
    this.getTodayReturns(false);
  }

  cancleReturn() {
    const currentClass = this;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Cancle Return ' + this.return.id,
      type: 'warning',
      showCancelButton: true,
      confirmButtonClass: 'btn-danger',
      confirmButtonText: 'Yes, cancle!',
      cancelButtonText: 'No'
    }).then(
      (willDelete) => {
        if (willDelete.value) {
          this.salesReturnService.cancleReturn(this.return).subscribe((data: any) => {
              // for (const product of this.returnProducts) {
              //
              //   if (this.return.status === '1') {
              //     this.salesReturnService.getStockInHand(product.stock_id).subscribe((dataa: any) => {
              //         const prod = {
              //           id: product.stock_id,
              //           available_qty: Number(dataa[0].available_qty) - Number(product.qty)
              //         };
              //         this.salesReturnService.updateStockQty(prod).subscribe((dataaa: any) => {
              //           }, (err) => {
              //             this.notifi.error('While updating stocks');
              //           }
              //         );
              //       }, (err) => {
              //         this.notifi.error('While updating stocks');
              //       }
              //     );
              //   }
              //
              // }
              this.loadReturn();
            }, (err) => {
              this.notifi.error('While cancelling return');
            }
          );
        }
      });
  }

  clickDone() {
    // for (const product of this.returnProducts) {
    //   const stockProduct = this.products.filter(x => x.id === product.stock_id)[0];
    //   stockProduct.available_qty = Number(stockProduct.available_qty) + Number(product.qty);
    //   this.salesReturnService.updateStockQty(stockProduct).subscribe((data: any) => {
    //     }, (err) => {
    //       this.notifi.error('While updating stocks');
    //     }
    //   );
    // }
    this.salesReturnService.doneReturn(this.return).subscribe((data: any) => {
      this.notifi.success('Printing return ticket');
      }, (err) => {
      this.notifi.error('While issuing return ticket');
      }
    );
    this.loadReturn();
  }

  removeProductFromReturn(index) {
    const product = this.getValidProducts()[index];
    product.qty--;
    product.amount -= product.selling_price;
    this.salesReturnService.updateProductOfAReturn(product).subscribe((data: any) => {
      this.getAllReturnProducts();
      }, (err) => {
      this.notifi.error('While fetching return products');
      }
    );
  }

  productEntered() {
    if (this.selectProducts.filter(x => x.toLowerCase().indexOf(this.productCode.toLowerCase()) > -1).length > 0) {
      const id = this.productCode.trim().split(':-')[0].trim();
      const filteredProducts = this.products.filter(x => x.id === id);
      if (filteredProducts.length > 0) {
        // chcek is the product is already in the invoice product list
        // const alreadyAddedProduct = this.returnProducts.filter(x => x.stock_id.trim() === id);
        // if (alreadyAddedProduct.length > 0) {
        //   alreadyAddedProduct[0].qty++;
        //   alreadyAddedProduct[0].amount = alreadyAddedProduct[0].selling_price * alreadyAddedProduct[0].qty;
        //   this.salesReturnService.updateProductOfAReturn(alreadyAddedProduct[0]).subscribe((data: any) => {
        //     this.getAllReturnProducts();
        //     }, (err) => {
        //     this.notifi.error('While updating return products');
        //     }
        //   );
        // } else {
          const product: ReturnProduct = {
            id: '',
            stock_id: id,
            qty: 1,
            selling_price: filteredProducts[0].selling_price,
            amount: filteredProducts[0].selling_price,
            product_description: filteredProducts[0].product_description,
            sales_return_id: this.return.id,
          };
          this.salesReturnService.addProductToReturn(product).subscribe((data: any) => {
            this.getAllReturnProducts();
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


  checkNewReturnOrPendidngReturn(createManyPendingreturns) {
    if (this.returns.length === 0) {
// generate a new invoice
      this.salesReturnService.newReturn().subscribe((dataa: any) => {
        this.getTodayReturns(true);
        }, (err) => {
        this.notifi.error('While creating return ticket');
        }
      );
    } else {
      this.salesReturnService.getReturn(this.returns[this.returns.length - 1].id).subscribe((data: any) => {
          data = data[0];
          if (data.status === '3' && !createManyPendingreturns) {
          this.currentReturn = this.returns.length - 1;
          this.getReturn();
        } else if (data.status === '3' && createManyPendingreturns) {
          this.salesReturnService.getProductsOfAReturn({id: data.id}).subscribe((dataa: any) => {
                if (dataa.length > 0) {
                  this.salesReturnService.newReturn().subscribe((dataaa: any) => {
                    this.getTodayReturns(true);
                    }, (err) => {
                      this.notifi.error('While creating invoice');
                    }
                  );
                } else {
                  this.getTodayReturns(true);
                }
              }, (err) => {
              this.notifi.error('While fetching return products');
              }
            );
          } else if (data.status !== '3') {
            // generate a new invoice
          this.salesReturnService.newReturn().subscribe((dataa: any) => {
              this.getTodayReturns(true);
              }, (err) => {
              this.notifi.error('While creating return ticket');
              }
            );
          }
        }, (err) => {
        this.notifi.error('While fetching returns');
        }
      );
    }
  }

  getTodayReturns(checkNewInvoiceOrPendidngInvoice) {
    this.salesReturnService.getTodayReturns().subscribe((data: any) => {
      this.returns = data;
      if (checkNewInvoiceOrPendidngInvoice) {
          this.checkNewReturnOrPendidngReturn(false);
        } else {
          this.checkNewReturnOrPendidngReturn(true);
        }
      }, (err) => {
      this.notifi.error('While fetching returns');
      }
    );
  }

  getReturn() {
    this.salesReturnService.getReturn(this.returns[this.currentReturn].id).subscribe((data: any) => {
      this.clearReturn();
      data = data[0];
      this.return.id = data.id;
      this.return.total = data.total;
      this.setReturnTime(data.issued_date);
      this.return.status = data.status;
      this.getAllReturnProducts();
      }, (err) => {
      this.notifi.error('While fetching returns');
      }
    );
  }


  gotoFirstReturn() {
    this.currentReturn = 0;
    this.getReturn();
  }

  gotoLatestReturn() {
    this.currentReturn = this.returns.length - 1;
    this.getReturn();
  }

  gotoPreviousReturn() {
    if (this.currentReturn > 0) {
      this.currentReturn--;
      this.getReturn();
    }
  }

  gotoNextReturn() {
    if (this.currentReturn < this.returns.length - 1) {
      this.currentReturn++;
      this.getReturn();
    }
  }

  clickInvoice() {
    this.router.navigateByUrl('/app/invoice');
    this.leftNavBarComponent.clickLink('#invoice');
  }

  ngAfterViewInit(): void {
    this.getProducts();
    this.loadReturn();
  }
}
