import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SmartTablesService {
  baseUrl = `http://54.93.252.106:8080/api`;

  constructor(private http: Http) { }

  getLabels() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get(`${this.baseUrl}/labels`, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        console.log(data.labels);
        return data.labels;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  deleteLabel(id) {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.delete(`${this.baseUrl}/labels/${id}`, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  // Upload a file label with or without photos
  uploadFileLabel(label: string, files: File[]) {
    const formData = new FormData();
    formData.append('label', label);
    for (var i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }

    // Header stuff
    const headers = new Headers();
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers });
    // End headers

    return this.http.post(`${this.baseUrl}/labels`,
      formData, options).map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data;
      }
      ).catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  // Update label
  editLabel(newLabel, id) {
    const req = { "label": newLabel };
    let headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`${this.baseUrl}/labels/${id}`,
      req, options)
      .map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data;
      },
    )
      .catch(
      (error: Response) => {
        const data = error.json();
        console.log(data);
        return Observable.throw('Failed@\n/register');
      },
    );
  }

  // Add photos to label
  addPhotosLabel(label: string, photos: File[]) {
    return this.uploadFileLabel(label, photos);
  }
}