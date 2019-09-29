import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbdSortableHeader } from './sortable.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbPaginationModule, NgbTabsetModule} from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageFoundComponent } from './page-found/page-found.component';
import { HeaderComponent } from './page-found/header/header.component';
import { FooterComponent } from './page-found/footer/footer.component';
import { MenueBarComponent } from './page-found/menue-bar/menue-bar.component';
import { LeftNavBarComponent } from './page-found/left-nav-bar/left-nav-bar.component';
import { ContentComponent } from './page-found/content/content.component';
import { LoaderComponent } from './page-found/loader/loader.component';
import { RightMenueComponent } from './page-found/right-menue/right-menue.component';
import {TablesComponent} from './page-found/content/tables/tables.component';
import { FullTemplateComponent } from './page-found/content/full-template/full-template.component';
import { DashboardComponent } from './page-found/content/dashboard/dashboard.component';
import { SupplierComponent } from './page-found/content/supplier/supplier.component';
import { GRNComponent } from './page-found/content/grn/grn.component';
import { ProductComponent } from './page-found/content/product/product.component';
import { DiscountComponent } from './page-found/content/discount/discount.component';
import { VoucherComponent } from './page-found/content/voucher/voucher.component';
import { InvoiceComponent } from './page-found/content/invoice/invoice.component';
import { CustomerComponent } from './page-found/content/customer/customer.component';
import { StockReturn } from './page-found/content/stock-return/stock-return.component';
import { UserComponent } from './page-found/content/user/user.component';
import { SalesComponent } from './page-found/content/sales/sales.component';

import {CommonModule, DatePipe, CurrencyPipe} from '@angular/common';
import {Ng2TableModule} from 'ng2-table/ng2-table';
import { GRNListComponent } from './page-found/content/grn-list/grn-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {InvoiceListComponent} from './page-found/content/invoice-list/invoice-list.component';
import {SalesReturnComponent} from './page-found/content/sales-return/sales-return.component';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {BarcodePdfComponent} from './page-found/content/barcode-pdf/barcode-pdf.component';
import {AuthGuard} from './auth.guard';
import {JwtModule} from '@auth0/angular-jwt';
import { PurchaseListComponent } from './page-found/content/purchase-list/purchase-list.component';
import { DailySummaryComponent } from './page-found/content/daily-summary/dailysummary.component';
import { MonthlySummaryComponent } from './page-found/content/monthly-summary/monthlysummary.component';
import { StockComponent } from './page-found/content/stock/stock.component';
import {UsersComponent} from "./page-found/content/users/users.component";
import { AnalyticsComponent } from './page-found/content/analytics/analytics.component';
import {SystemSettingsComponent} from "./page-found/content/system-settings/system-settings.component";
import {ErrorInterceptor} from "./error.interceptor";
import {ResponseInterceptor} from "./response.interceptor";
import {LoanPlanComponent} from "./page-found/content/loan-plan/loan-plan.component";

@NgModule({
  declarations: [

    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    PageFoundComponent,
    HeaderComponent,
    FooterComponent,
    MenueBarComponent,
    LeftNavBarComponent,
    ContentComponent,
    LoaderComponent,
    RightMenueComponent,
    TablesComponent,
    DashboardComponent,
    FullTemplateComponent,
    SupplierComponent,
    GRNComponent,
    ProductComponent,
    StockComponent,
    DiscountComponent,
    VoucherComponent,
    InvoiceComponent,
    CustomerComponent,
    SalesReturnComponent,
    StockReturn,
    UserComponent,
    SalesComponent,
    NgbdSortableHeader,
    GRNListComponent,
    InvoiceListComponent,
    BarcodePdfComponent,
    PurchaseListComponent,
    DailySummaryComponent,
    MonthlySummaryComponent,
    UsersComponent,
    AnalyticsComponent,
    SystemSettingsComponent,
    LoanPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    Ng2TableModule,
    NgbTabsetModule,
    PdfJsViewerModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    }),
  ],

  providers: [
    DatePipe,
    AuthGuard,
    CurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [AppComponent],
})
export class AppModule { }
