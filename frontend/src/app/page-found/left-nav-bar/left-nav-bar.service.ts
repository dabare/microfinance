import {Injectable} from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class LeftNavBarService {

  private previousEl = '';

  constructor() {

  }

  clickLink(el) {
    if (this.previousEl) {
      $(this.previousEl).removeClass('active');
    }
    $(el).addClass('active');
    $('#mainTitle').html($(el).attr('title'));
    this.previousEl = el;
  }
}
