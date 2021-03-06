import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FinanceService {


  constructor() {
  }

  public addIndex(array: any[]) {
    for (let index = 0; index < array.length; index++) {
      array[index].index = index;
    }
  }

  public getCustomerCode(id) {
    while (id.length < 3) {
      id = '0' + id;
    }
    return 'MEM' + id;
  }

  public getDepositCode(id) {
    while (id.length < 5) {
      id = '0' + id;
    }
    return 'INVL' + id;
  }

  public getSavingCode(id) {
    while (id.length < 5) {
      id = '0' + id;
    }
    return 'INVD' + id;
  }

  public getWithdrawCode(id) {
    while (id.length < 5) {
      id = '0' + id;
    }
    return 'INVW' + id;
  }

  public getLoanCode(id) {
    while (id.length < 4) {
      id = '0' + id;
    }
    return 'LOAN' + id;
  }

  public cents2rupees(cents) {
    cents = Math.ceil(cents);
    let sign = '';
    if (cents < 0) {
      sign = '-';
      cents *= -1;
    }
    const rupees = Math.floor(cents / 100);
    cents = cents % 100 + '';
    while (cents.length < 2) {
      cents = '0' + cents;
    }
    return sign + rupees + '.' + cents;
  }

  public toLocale(str) {
    return Number(str.split('.')[0]).toLocaleString('en') + '.' + str.split('.')[1];
  }

  public processSavingHistory(data: any[]) {
    const d = new Date();
    let dd = d.getFullYear() + '-' + (d.getMonth() + 1) ;
    if ( d.getDate() < 10) {
      dd += '-0' + d.getDate();
    } else {
      dd += '-' + d.getDate();
    }
    let firstSaving = 0;
    let currentRateIndex = 0;
    data.push(
      {
        trx_type: 'BALANCE',
        req_date: dd
      }
    );
    for (let i = 0; i < data.length; i++) {

      if (firstSaving === 0 && data[i].trx_type !== 'RATE') {
        firstSaving = i;
      }

      if (data[i].trx_type === 'RATE') {
        data[i].description = 'Rate Change ' + data[i].description;
        data[i].amount = 0;
        currentRateIndex = i;
      } else if (data[i].trx_type === 'DEPOSIT') {
        data[i].description = 'Deposit ' + data[i].description;
        data[i].amount = Number(data[i].value);
      } else if (data[i].trx_type === 'WITHDRAWAL') {
        data[i].description = 'Withdrawal ' + data[i].description;
        data[i].amount = -1 * Number(data[i].value);
      } else if (data[i].trx_type === 'BALANCE') {
        data[i].description = 'Balance Upto Now';
        data[i].amount = 0;
      }

      const newDate = new Date(data[i].req_date.split('-')[0],
        data[i].req_date.split('-')[1], data[i].req_date.split('-')[2]);
      let oldDate = newDate;

      data[i].rate = Number(data[currentRateIndex].value);

      if (i === 0) {
        data[i].interest = 0;
        data[i].balance = 0;
        data[i].total = 0;
        data[i].days_passed = 0;
      } else if (i > 0) {
        oldDate = new Date(data[i - 1].req_date.split('-')[0],
          data[i - 1].req_date.split('-')[1], data[i - 1].req_date.split('-')[2]);
        data[i].days_passed = Math.ceil((newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24));
        data[i].interest = (data[i - 1].total * data[i].days_passed
          * data[i - 1].rate) / 36500;
        data[i].balance = data[i - 1].total + data[i].interest;
        data[i].total = data[i].balance + data[i].amount;
      }

    }
    data[firstSaving - 1].interest = 0;
    data[firstSaving - 1].balance = 0;
    data[firstSaving - 1].total = 0;
    data[firstSaving - 1].days_passed = 0;
    return data.slice(firstSaving - 1, data.length);
  }

  public processLoanHistory(data: any[], initDate, amount, durationMonths, rate, penalty) {
    const interest = (amount * rate * durationMonths) / 1200;
    const total = amount + interest;
    const rental = total / durationMonths;
    data = this.preProcessLoanData(data, initDate, total);
    return data;
  }

  private preProcessLoanData(data: any[], initDate, total) {
    for (let i = 0; i < data.length; i++) {
      data[i].credit = data[i].amount;
      data[i].debit = 0;
      data[i].description = data[i].note;
      if (data[i].status !== '1') {
        data[i].credit = 0;
        data[i].description = 'CANCELLED :' + data[i].description;
      }
      data[i].trx_type = 'DEPOSIT';
    }
    data.unshift({
      req_date: initDate,
      description: 'Request total',
      credit: 0,
      debit: total,
      trx_type: 'INIT'
    });
    const d = new Date();
    let dd = d.getFullYear() + '-' + (d.getMonth() + 1) ;
    if ( d.getDate() < 10) {
      dd += '-0' + d.getDate();
    } else {
      dd += '-' + d.getDate();
    }
    data.push({
        req_date: dd,
        description: 'Due amount',
        credit: 0,
        debit: 0,
        trx_type: 'TODAY'
      });
    return data;
  }
}
