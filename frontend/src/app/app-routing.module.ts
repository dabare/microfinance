import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {PageFoundComponent} from './page-found/page-found.component';
import { UserComponent } from './page-found/content/user/user.component';
import {AuthGuard} from './auth.guard';
import {SystemSettingsComponent} from './page-found/content/system-settings/system-settings.component';
import {LoansComponent} from './page-found/content/loans/loans.component';
import {LoanDepositsComponent} from './page-found/content/loan-deposits/loan-deposits.component';
import {CustomerComponent} from "./page-found/content/customer/customer.component";
import {SavingRateComponent} from "./page-found/content/saving-rate/saving-rate.component";
import {SavingsComponent} from "./page-found/content/savings/savings.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'app',
    component: PageFoundComponent,
    canActivate: [AuthGuard] ,
    data: { roles: ['13', '1', '2', '3'] },
    children: [
      {path: 'dashboard', component: CustomerComponent, canActivate: [AuthGuard] , data: { roles: ['13', '3'] }},
      {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '2', '3'] }},
      {path: 'user', component: UserComponent, canActivate: [AuthGuard] , data: { roles: ['13', '1', '2', '3'] }},
      {path: 'system-settings', component: SystemSettingsComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
      {path: 'loans', component: LoansComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
      {path: 'loan-deposits', component: LoanDepositsComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
      {path: 'saving-rate', component: SavingRateComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
      {path: 'savings', component: SavingsComponent, canActivate: [AuthGuard] , data: { roles: ['13'] }},
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
