import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class MiddlewareService {

  constructor(private httpClient: HttpClient) {
  }

  select(table, where, group, order) {
    return this.httpClient.post(environment.middlewareUrl + '/selection', {
      Table: table,
      Where: where,
      Group: group,
      Order: order
    });
  }

  insert(table, columns, values) {
    return this.httpClient.post(environment.middlewareUrl + '/insertion', {
      Table: table,
      Columns: columns,
      Values: values
    });
  }

  update(table, set, where) {
    return this.httpClient.post(environment.middlewareUrl + '/update', {Table: table, Set: set, Where: where});
  }

  deletee(table, where) {
    return this.httpClient.post(environment.middlewareUrl + '/deletion', {Table: table, Where: where});
  }

}
