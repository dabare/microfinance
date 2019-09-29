import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AnalyticsService } from './analytics.service';
import { NotificationsService } from 'src/app/utils/notifications';
import * as CanvasJS from '../../../../assets/files/assets/js/canvasjs.min.js';
import { SupplierService } from '../supplier/supplier.service';
//var CanvasJS = require('./canvasjs.min');
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-tables',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})

export class AnalyticsComponent implements OnInit, AfterViewInit {
  invoice_monthly: any[] = [];
  top_suppliers: any[] = [];
  top_products: any[] = [];
  top_brands: any[] = [];
  invoice_daily: any[] = [];
  invoice_month = {
    income: 0,
    total_invoice: 0,
  }
  invoice_day = {
    income: 0,
    total_invoice: 0,
  }
  myObj = {
    "width": "80%"
  }
  monthlyGraphIncome: any[] = [];
  dailyDepartmentSales: any[] = [];
  grn_monthly: any[] = [];
  dataPoints: any[] = [];
  grn_daily: any[] = [];
  grn_month = {
    income: 0,
    total_grn: 0,
  }
  grn_day = {
    income: 0,
    total_grn: 0,
  }
  totalSupplierRating = 0;
  totalProductRating = 0;
  constructor(private analyticsService: AnalyticsService, private supplierService: SupplierService, private notifi: NotificationsService) { }

  ngOnInit() {
    // let chart = new CanvasJS.Chart("chartContainer", {
    //   animationEnabled: true,
    //   exportEnabled: true,
    //   title: {
    //     text: "Basic Column Chart in Angular"
    //   },
    //   data: [{
    //     type: "column",
    //     dataPoints: [
    //       { y: 71, label: "Apple" },
    //       { y: 55, label: "Mango" },
    //       { y: 50, label: "Orange" },
    //       { y: 65, label: "Banana" },
    //       { y: 95, label: "Pineapple" },
    //       { y: 68, label: "Pears" },
    //       { y: 28, label: "Grapes" },
    //       { y: 34, label: "Lychee" },
    //       { y: 14, label: "Jackfruit" }
    //     ]
    //   }]
    // });

    // chart.render();
    this.getMonthlyIncomeData();
    this.getDepartmentSalesDaily();
    this.getDepartmentSaleMonthly();
  }
  ngAfterViewInit(): void {
    this.getMonthlyIncome();
    this.getHomeIncomeDaily();
    this.getMonthlyOutcome();
    this.getHomeOutcomeDaily();
    this.getTopSuppliers();
    this.getTopProducts();
    this.gettopSellingBrands();
  }

  getMonthlyIncomeData() {
    this.analyticsService.getMonthlyIncomeData().subscribe((data: any) => {
      this.monthlyGraphIncome = data;
      console.log(this.monthlyGraphIncome.length);
      for (var x = 0; x < this.monthlyGraphIncome.length; x++) {
        this.monthlyGraphIncome[x].y = parseInt(this.monthlyGraphIncome[x].y);

      }
      console.log(this.monthlyGraphIncome);

      let chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Monthly Revenue"
        },
        data: [{
          type: "line",
          dataPoints: this.monthlyGraphIncome
        },
        // {
        //   type: "column",
        //   dataPoints: this.monthlyGraphIncome
        // }
      ]
      });

      chart.render();


    }, (err) => {
    }
    );
  }
  getDepartmentSalesDaily() {
    this.analyticsService.getDepartmentSalesDaily().subscribe((data: any) => {
      this.dailyDepartmentSales = data;
      console.log(this.dailyDepartmentSales.length);
      for (var x = 0; x < this.dailyDepartmentSales.length; x++) {
        this.dailyDepartmentSales[x].y = parseInt(this.dailyDepartmentSales[x].y);

      }
      console.log(this.dailyDepartmentSales);

      let chart = new CanvasJS.Chart("chartContainer2", {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Daily Department Sales"
        },
        data: [{
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: Count {y} (#percent%)",
          indexLabel: "{name} - #percent%",
           dataPoints: this.dailyDepartmentSales
        }]
      });

      chart.render();

    }, (err) => {
    }
    );
  }
  getDepartmentSaleMonthly() {
    this.analyticsService.getDepartmentSalesMonthly().subscribe((data: any) => {
      this.dailyDepartmentSales = data;
      console.log(this.dailyDepartmentSales.length);
      for (var x = 0; x < this.dailyDepartmentSales.length; x++) {
        this.dailyDepartmentSales[x].y = parseInt(this.dailyDepartmentSales[x].y);

      }
      console.log(this.dailyDepartmentSales);

      let chart = new CanvasJS.Chart("chartContainer3", {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: {
          text: "Monthly Department Sales"
        },
        data: [{
          type: "pie",
          showInLegend: true,
          toolTipContent: "<b>{name}</b>: Count {y} (#percent%)",
          indexLabel: "{name} - #percent%",
           dataPoints: this.dailyDepartmentSales
        }]
      });

      chart.render();

    }, (err) => {
    }
    );
  }
  getMonthlyIncome() {
    this.analyticsService.getMonthlyIncome().subscribe((data: any) => {

      this.invoice_monthly = data;;
      this.invoice_month.income = this.invoice_monthly[0].total;
      this.invoice_month.total_invoice = this.invoice_monthly[0].totalInvoice;
    }, (err) => {
    }
    );
  }

  getTopSuppliers() {
    this.supplierService.getSupplierTotalRating().subscribe((data: any) => {
      this.totalSupplierRating = data[0].totalRating;
      this.analyticsService.getTopSuppliers().subscribe((data: any) => {
        this.top_suppliers = data;
      }, (err) => {
      }
      );
    }, (err) => {
      this.notifi.error('While updating stocks');
    });
  }

  getTopProducts() {
    this.analyticsService.getProductTotalRating().subscribe((data: any) => {
      this.totalProductRating = data[0].totalRating;
      this.analyticsService.getTopProducts().subscribe((data: any) => {
        this.top_products = data;
      }, (err) => {
      }
      );
    }, (err) => {
      this.notifi.error('While updating stocks');
    });
  }
  gettopSellingBrands() {
     
      this.analyticsService.gettopSellingBrands().subscribe((data: any) => {
        this.top_brands = data;
      }, (err) => {
      }
      );
   
  }
  getHomeIncomeDaily() {
    this.analyticsService.getHomeIncomeDaily().subscribe((data: any) => {

      this.invoice_daily = data;;
      this.invoice_day.income = this.invoice_daily[0].total;
      this.invoice_day.total_invoice = this.invoice_daily[0].totalInvoice;
    }, (err) => {
    }
    );
  }

  getMonthlyOutcome() {
    this.analyticsService.getHomeOutcomeMonthly().subscribe((data: any) => {

      this.grn_monthly = data;;
      this.grn_month.income = this.grn_monthly[0].total;
      this.grn_month.total_grn = this.grn_monthly[0].totalGRN;
    }, (err) => {
    }
    );
  }
  getHomeOutcomeDaily() {
    this.analyticsService.getHomeOutcomeDaily().subscribe((data: any) => {

      this.grn_daily = data;;
      this.grn_day.income = this.grn_daily[0].total;
      this.grn_day.total_grn = this.grn_daily[0].totalGRN;
    }, (err) => {
    }
    );
  }


}
