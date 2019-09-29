import {Injectable} from '@angular/core';

declare var PNotify: any;
declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private delay = 3000;

  info(Text, Title = 'Info') {
    new PNotify({
      title: Title,
      text: Text,
      type: 'info',
      icon: 'icofont icofont-info-circle',
      delay: this.delay,
    }).get().click(function() {
      this.remove();
    });
  }

  error(Text, Title = 'Error') {
    new PNotify({
      title: Title,
      text: Text,
      type: 'error',
      icon: 'icofont icofont-exclamation-circle',
      delay: this.delay,
    }).get().click(function() {
      this.remove();
    });
  }

  success(Text, Title = 'Success') {
    new PNotify({
      title: Title,
      text: Text,
      type: 'success',
      icon: 'icofont icofont-check-circled',
      delay: this.delay,
    }).get().click(function() {
      this.remove();
    });
  }

  notice(Text, Title = 'Notice') {
    new PNotify({
      title: Title,
      text: Text,
      icon: 'icofont icofont-info-square',
      delay: this.delay,
      // styling : 'bootstrap3',
    }).get().click(function() {
      this.remove();
    });
  }

  permanantNotice(Text, Title = 'Notice') {
    new PNotify({
      title: Title,
      text: Text,
      icon: 'icofont icofont-info-square',
      delay: 9999999,
      // styling : 'bootstrap3',
    }).get().click(function() {
      this.remove();
    });
  }
}
