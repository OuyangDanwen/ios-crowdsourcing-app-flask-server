import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions  } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class SmartTablesService {
  constructor(private http: Http) { }

    // TODO: Change this to proper route
  getLabels() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/labels', { headers: headers })
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

  // retrain() {
    // const token = localStorage.getItem('access_token');
    // const headers = new Headers();
    // headers.append('Authorization', 'Bearer ' + token);
    // return this.http.get('http://54.93.252.106:8080/api/retrain', { headers: headers })
      // .map(
      // (response: Response) => {
        // const data = response.json();
        // return data;
      // }
      // )
      // .catch(
      // (error: Response) => {
        // return Observable.throw('Something went wrong');
      // }
      // );
  // }

    deleteLabel(label) {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token); 

    return this.http.delete('http://54.93.252.106:8080/api/labels/' + label,{ headers: headers })
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

    return this.http.post('http://54.93.252.106:8080/api/labels',
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
    editLabel(oldLabel: string, newLabel: string) {
    const req = { "label": oldLabel, "newlabel": newLabel};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });    

    return this.http.put('http://54.93.252.106:8080/api/labels',
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
  addPhotosLabel(label: string, photos: File[]){
    return this.uploadFileLabel(label, photos);
  }

}
