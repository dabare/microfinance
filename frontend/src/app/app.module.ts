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
import { CustomerComponent } from './page-found/content/customer/customer.component';
import { UserComponent } from './page-found/content/user/user.component';

import {CommonModule, DatePipe, CurrencyPipe} from '@angular/common';
import {Ng2TableModule} from 'ng2-table/ng2-table';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
import {AuthGuard} from './auth.guard';
import {SystemSettingsComponent} from './page-found/content/system-settings/system-settings.component';
import {ErrorInterceptor} from './error.interceptor';
import {ResponseInterceptor} from './response.interceptor';
import {LoansComponent} from './page-found/content/loans/loans.component';
import {LoanDepositsComponent} from './page-found/content/loan-deposits/loan-deposits.component';
import {SavingRateComponent} from "./page-found/content/saving-rate/saving-rate.component";
import {SavingsComponent} from "./page-found/content/savings/savings.component";

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
    CustomerComponent,
    UserComponent,
    NgbdSortableHeader,
    SystemSettingsComponent,
    LoansComponent,
    LoanDepositsComponent,
    SavingRateComponent,
    SavingsComponent
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
