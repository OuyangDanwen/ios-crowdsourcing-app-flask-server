import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {

  metricsTableData = [];
  constructor(private http: Http) { }
  upload(file: File) {
    const formData = new FormData();
    formData.append('file[]', file);

    const headers = new Headers({});
    let options = new RequestOptions({ headers });

    console.log(file);
    return this.http.post('http://54.93.252.106:8080/api/dashboard/predictions',
      formData, options).map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        // console.log(data.Object[0].label);
        return data.labels;
      }
      ).catch(
      (error: Response) => {
        return Observable.throw('Failed@\n/api/predict');
      }
      );
  }

  // WE UPLOAD A SINGLE RESOURCE INSTEAD OF MULTIPLES!!!
  // Maybe in future add support for multiple
  uploadRes(file: File) {
    const formData = new FormData();
    const resType: string = "document";
    const resName: string = "A-23";
    const resLabel: string = "microwave";
    const resUrl: string = "http://54.93.252.106:8080/api/resources";

    formData.append("file", file);
    formData.append("name", resName);
    formData.append("type", resType);
    formData.append("label", resLabel);

    switch (resType) {
      case 'link':
        formData.append("url", resUrl);
        break;
      case 'audio':
      case 'video':
      case 'document':
        formData.append("size", String(file.size));
        break;
      default:
        console.log("Invalid Resource type @ uploading resource")
        break;
    }
    const headers = new Headers();
    const token = localStorage.getItem('access_token');

    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers });

    console.log(formData);
    return this.http.post('http://54.93.252.106:8080/api/resources',
      formData, options).map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        // console.log(data.Object[0].label);
        return data;
      }
      ).catch(
      (error: Response) => {
        const data = error.json();
        console.log(data);
        return Observable.throw('Failed@\n/api/resources');
      }
      );
  }

  uploadFileLabel(label: string, files: File[], saveFiles: boolean) {
    console.log("FILES " + saveFiles);
    const formData = new FormData();
    formData.append('label', label);
    for (var i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }
    if (saveFiles) {
      formData.append('hasFiles', "True");
    }
    else {
      formData.append('hasFiles', "False");
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
    return this.http.get('http://54.93.252.106:8080/api/version', { headers: headers })
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

  showRetrainingInfo() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/retraining_info', { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Failed@\n/api/retraining');
      }
      );
  }

  showRepoVersion() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/backend_version', { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Failed@\n/api/backend_version');
      }
      );
  }


  retrain() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/retrain', { headers: headers })
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

}