import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SmartTablesService {
  constructor(private http: Http) {}
  // TODO: Change this to proper route
  getServers() {
        const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/labels', {headers:headers})
      .map(
        (response: Response) => {
          const data = response.json();
          console.log(data.labels);
          var text = JSON.stringify(data.labels);
          return data.labels;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }
}
