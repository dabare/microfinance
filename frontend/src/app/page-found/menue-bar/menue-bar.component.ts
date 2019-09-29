import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { NotificationsService } from 'src/app/utils/notifications';
import { MenuBarService } from './menu-bar.service';

@Component({
  selector: 'app-menue-bar',
  templateUrl: './menue-bar.component.html',
  styleUrls: ['./menue-bar.component.scss']
})
export class MenueBarComponent implements OnInit, AfterViewInit {
  user = '';
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
  products_one: Array<any> = [];
  products_all: Array<any> = [];
  constructor(private menubarServie: MenuBarService, private notifi: NotificationsService, private loginService: LoginService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.user = this.loginService.getUser().name;
    this.getAllProducts();
  }

  logOut() {
    this.loginService.logout();
  }
  getAllProducts() {
    this.products = [];
    this.menubarServie.getAllProduct().subscribe((data: any) => {
      this.products=data;
      for (var i = 0; i <  this.products.length; i++) { 
        if ( Number(this.products[i].available_qty) <= Number(this.products[i].alert_qty)) {
          this.products_all.push(this.products[i]);
        }
      } 
     
    }, (err) => {
    }
    );
  }
}
