import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class LeftNavBarService {

  private linkMap = {
    '/app/customer': '#member',
    '/app/loan-deposits': '#loan-deposits',
    '/app/loans': '#loans',
    '/app/dashboard': '#dashboard',
    '/app/savings': '#savings',
    '/app/saving-rate': '#saving-rate',
  };

  private previousEl = '';

  constructor(private router: Router) {

  }

  clickLink(el) {
    if (this.previousEl) {
      $(this.previousEl).removeClass('active');
    }
    $(el).addClass('active');
    $('#mainTitle').html($(el).attr('title'));
    this.previousEl = el;
  }

  public navigate(path, params) {
    this.router.navigate([path], params);
    this.clickLink(this.linkMap[path]);
  }
}
