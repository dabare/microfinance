import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MiddlewareService } from '../../middleware.service';
@Injectable({
  providedIn: 'root'
})
export class MenuBarService {
  constructor(private httpClient: HttpClient, private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  }
  getAllProduct() {
    return this.middlewareService.select('viewAllProducts', '', '', '');
  }
}
