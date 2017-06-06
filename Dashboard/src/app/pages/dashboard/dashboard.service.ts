import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class DashboardService {
  metricsTableData = [];
  constructor(private http: Http) {}
  // TODO: Change this to proper route
  getServers() {
    return this.http.get('http://54.93.252.106:8080/test')
      .map(
        (response: Response) => {
          const data = response.json();
          return data.labels;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Failed@\n/test');
        }
      );
  }
  upload(file: File){
      const formData = new FormData();
        formData.append('file[]', file);
        // formData.append('file[]', file);
        // formData.append('file[]', file);

        const headers = new Headers({});
        let options = new RequestOptions({ headers });

      console.log(file);
    return this.http.post('http://54.93.252.106:8080/predict_image',
      formData, options).map(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          // console.log(data.Object[0].label);
          return data;
        }
     ).catch(
        (error: Response) => {
          return Observable.throw('Failed@\n/api/predict');
        }
      );
  }

  uploadFileLabel(tempString: string, base64String: string){
        const formData = new FormData();
        formData.append('command','label');
        formData.append('image', base64String);
        formData.append('label',tempString);


        const headers = new Headers({});
        let options = new RequestOptions({ headers });

      
    return this.http.post('http://54.93.252.106:8080/post',
      formData, options).map(
        (response: Response) => {
          const data = response.json();
          console.log(data);
          // console.log(data.Object[0].label);
          return data;
        }
     ).catch(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
      );
  }



  showVersion() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/version', {headers:headers})
      .map(
        (response: Response) => {
          const data = response.json();
          return data.version;
        }
      )
      .catch(
        (error: Response) => {
          return Observable.throw('Failed@\n/api/version');
        }
      );
  }
}
