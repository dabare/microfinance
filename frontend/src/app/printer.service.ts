import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class PrinterService {

  private printObject = {
    printer: '',
    file: '',
    data: null
  };


  constructor(private httpClient: HttpClient) {
    this.printObject.printer = 'EPSON';
  }

  print(filename, data) {
    this.printObject.file = filename;
    this.printObject.data = data;
    return this.httpClient.post(environment.middlewareUrl + '/printingApiUrl', this.printObject);
  }
}
