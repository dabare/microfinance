import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageFoundComponent} from './page-found/page-found.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {TablesComponent} from './page-found/content/tables/tables.component';
import {DashboardComponent} from './page-found/content/dashboard/dashboard.component';
import {FullTemplateComponent} from './page-found/content/full-template/full-template.component';
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
import { GRNListComponent } from './page-found/content/grn-list/grn-list.component';
import {InvoiceListComponent} from './page-found/content/invoice-list/invoice-list.component';
import {SalesReturnComponent} from './page-found/content/sales-return/sales-return.component';
import {BarcodePdfComponent} from './page-found/content/barcode-pdf/barcode-pdf.component';
import {AuthGuard} from './auth.guard';
import { PurchaseListComponent } from './page-found/content/purchase-list/purchase-list.component';
import { DailySummaryComponent } from './page-found/content/daily-summary/dailysummary.component';
import { MonthlySummaryComponent } from './page-found/content/monthly-summary/monthlysummary.component';
import { StockComponent } from './page-found/content/stock/stock.component';
import {UsersComponent} from './page-found/content/users/users.component';
import { AnalyticsComponent } from './page-found/content/analytics/analytics.component';
import {SystemSettingsComponent} from './page-found/content/system-settings/system-settings.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'app',
    component: PageFoundComponent,
    canActivate: [AuthGuard] ,
    data: { roles: ['13', '1', '2', '3'] },
    children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] , data: { roles: ['13', '2', '3'] }},
      {path: 'grn', component: GRNComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'product', component: ProductComponent, canActivate: [AuthGuard] , data: { roles: ['13', '2', '3'] }},
      {path: 'stock', component: StockComponent, canActivate: [AuthGuard] , data: { roles: ['13', '2', '3'] }},
      {path: 'discount', component: DiscountComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'voucher', component: VoucherComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '3'] }},
      {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '2', '3'] }},
      {path: 'stock-return', component: StockReturn, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'sales-return', component: SalesReturnComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '3'] }},
      {path: 'user', component: UserComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '2', '3'] }},
      {path: 'sales', component: SalesComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'grn-list', component: GRNListComponent, canActivate: [AuthGuard] , data: { roles: ['13', '2', '3'] }},
      {path: 'invoice-list', component: InvoiceListComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3', '1'] }},
      {path: 'tables', component: TablesComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'full-template', component: FullTemplateComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'barcode-pdf', component: BarcodePdfComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
      {path: 'purchase-list', component: PurchaseListComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'dailysummary', component: DailySummaryComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'monthlysummary', component: MonthlySummaryComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'users', component: UsersComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'system-settings', component: SystemSettingsComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
    ]
  },

  {
    path: '',
    redirectTo: '/app/login',
    pathMatch: 'full'
  },
  // { path: '**', component: PageNotFoundComponent }
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
