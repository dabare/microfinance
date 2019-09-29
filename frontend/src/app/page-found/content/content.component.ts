import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NotificationsService} from '../../utils/notifications';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {

  constructor(private notifi: NotificationsService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }


}
