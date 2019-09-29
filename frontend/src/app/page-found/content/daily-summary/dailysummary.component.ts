import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'src/app/utils/notifications';
import Swal from 'sweetalert2';
import { SupplierService } from '../supplier/supplier.service';
import { DailySummaryService } from './dailysummary.service';
import { LoginService } from 'src/app/login/login.service';
declare var $: any;
declare var jquery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './dailysummary.component.html',
  styleUrls: ['./dailysummary.component.scss'],
})
export class DailySummaryComponent implements OnInit, AfterViewInit {


  actionMode = '';
  dailySummarySet: any[] = [];
  paymentTypeSalesSet: any[] = [];
  genderSalesSet: any[] = [];
  dailySummary = {
    id: -1,
    grossSales: 0.0,
    grossSales_p: '0.0',
    overallDiscount: '0.0',
    cashSaleAmount: '0.0',
    CardSaleAmount: '0.0',
    netAmount: '0.0',
    generalSales: '0.0',
    gentsSales: '0.0',
    ladiesSales: '0.0',
    girlsSales: '0.0',
    boysSales: '0.0',
    kidsSales: '0.0',
    salesReturnsQty: 0,
    salesRetrunsAmount: '0.00',
    cashBalance: 0.0,
    cashBalance_p: '0.0',
    current_date: '',
    userid: -1

  };
  data = {
    dailySummary: this.dailySummary,
    paymentTypeSalesSet: this.paymentTypeSalesSet,
    genderSalesSet: this.genderSalesSet,
  }

  printObject = {
    printer: "",
    file: "daily_sales_report.odt",
    data: this.data
  }
  totalSupplierRating = 0;
  constructor(private loginService: LoginService, private dailySummaryService: DailySummaryService, private notifi: NotificationsService) {
  }

  ngOnInit(): void {
    this.getDailySummuryReport();
  }

  ngAfterViewInit(): void {

  }

  getDailySummuryReport() {
    var d2 = new Date().toLocaleDateString().replace(/T/, ' ').replace(/\..+/, '');
    this.dailySummary.current_date = d2;
    this.dailySummaryService.getHomeIncomeDaily().subscribe((data: any) => {

      this.dailySummary.grossSales = Number(data[0].total) + Number(data[0].discount);
      this.dailySummary.grossSales_p = parseFloat(this.dailySummary.grossSales.toString()).toFixed(2);
      this.dailySummary.overallDiscount = parseFloat(data[0].discount).toFixed(2);
      this.dailySummary.netAmount = parseFloat(data[0].total).toFixed(2);
      this.dailySummaryService.getPaymentTypeSales().subscribe((data: any) => {
        this.paymentTypeSalesSet = data;
        this.dailySummaryService.getDepartmentSalesDaily().subscribe((data: any) => {
          this.genderSalesSet = data;
          this.dailySummaryService.getDailyReturnTotal().subscribe((data: any) => {
            if(data[0].totalReturn==""){
              data[0].totalReturn="0.00"
            }
            this.dailySummary.salesReturnsQty = data[0].returnCount;
            console.log(data[0].totalReturn);
            this.dailySummary.salesRetrunsAmount = parseFloat(data[0].totalReturn).toFixed(2);
            this.dailySummary.cashBalance = Number(this.dailySummary.netAmount) - Number(this.dailySummary.salesRetrunsAmount);
            this.dailySummary.cashBalance_p = parseFloat(this.dailySummary.cashBalance.toString()).toFixed(2);
            this.dailySummary.userid = this.loginService.getUser().name;
            for (var x = 0; x < this.paymentTypeSalesSet.length; x++) {
              this.paymentTypeSalesSet[x].total=parseFloat( this.paymentTypeSalesSet[x].total).toFixed(2); 
           }
           for (var x = 0; x < this.genderSalesSet.length; x++) {
            this.genderSalesSet[x].total=parseFloat( this.genderSalesSet[x].total).toFixed(2); 
         }
          }, (err) => {
          });
        }, (err) => {
        });
      }, (err) => {
      });
    }, (err) => {
    });


  }
  print() {
 
    this.data = {
      dailySummary: this.dailySummary,
      paymentTypeSalesSet: this.paymentTypeSalesSet,
      genderSalesSet: this.genderSalesSet,
    }

    this.printObject = {
      printer: "",
      file: "daily_sales_report.odt",
      data: this.data
    }
    this.dailySummaryService.printReport(this.printObject).subscribe((data: any) => {
      this.notifi.success("Printing.....!");

    }, (err) => {
      console.log(err);
      this.notifi.error("Error while printing", "Please try again!");
    }
    );
  }

}

