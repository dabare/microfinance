import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import {MiddlewareService} from '../../../middleware.service';

@Injectable({
  providedIn: 'root'
})

export class InvoiceListService {
  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
  }

  getAllInvoices() {
    return this.middlewareService.select('viewAllInvoices', '', '', '',);
  }

  getProductsOfAnInvoice(invoice) {
    return this.middlewareService.select('invoice_has_stock', 'invoice_id=\'' + invoice.id + '\'', '', 'id ASC');
  }
}
