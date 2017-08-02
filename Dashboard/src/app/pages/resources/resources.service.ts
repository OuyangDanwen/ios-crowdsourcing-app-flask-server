import { EventEmitter, Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ResourcesService {
  baseUrl = `http://54.93.252.106:8080/api`;
  addRowEmitter: any = new EventEmitter<any>();
  editRowEmitter: any = new EventEmitter<any>();
  deleteRowEmitter: any = new EventEmitter<any>();

  constructor(private http: Http) { }

  getContentFeed(name: string){
    console.log(name);
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(`${this.baseUrl}/resources/${name}`, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        return data;
      }
      )
      .catch(
      (error: Response) => {
        console.log(error);
        return Observable.throw('Something went wrong@getContentFeedContent');
      }
      );
  }

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

  getResources() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.get(`${this.baseUrl}/resources`, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        console.log(data.resources);
        return data.resources;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  deleteResource(row) {
    const id = row._id.$oid;
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.http.delete(`${this.baseUrl}/resources/${id}`, { headers: headers })
      .map(
      (response: Response) => {
        const data = response.json();
        this.deleteRowEmitter.emit(row);
        console.log("emitted deleted");
        return data;
      }
      )
      .catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

  uploadResource(resName: string, resLabel: string,
    resType: string, resUrl: string, file: File, locationLatitude: number,
    locationLongitude: number, adapterType: string, maxResults: number) {

    const formData = new FormData();
    // Attach data 
    formData.append("name", resName);
    formData.append("type", resType);
    formData.append("label", resLabel);
    formData.append('longitude', String(locationLongitude));
    formData.append('latitude', String(locationLatitude));
    console.log("Test " + String(locationLongitude) + "," + String(locationLatitude))
    switch (resType) {
      case 'link':
        formData.append("url", encodeURI(resUrl));
        break;
      case 'audio':
      case 'video':
      case 'document':
      case 'text':
        formData.append("file", file);
        formData.append("size", String(file.size));
        formData.append("ext", file.name.split('.').pop());
        break;
      case 'contentfeed':
        formData.append("adapterType", adapterType);
        formData.append("query", resLabel);
        formData.append("maxResults", String(maxResults));
        break;
      default:
        console.log("Invalid Resource type @ uploading resource")
        break;
    }
    console.log(formData);
    console.log("DATA: " + resName + resLabel + resType + resUrl);
    // Header stuff
    const headers = new Headers();
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers });
    // End headers

    return this.http.post(`${this.baseUrl}/resources`,
      formData, options).map(
      (response: Response) => {
        const data = response.json();
        this.addRowEmitter.emit(data);
        console.log(data);
        return data;
      }
      ).catch(
      (error: Response) => {
        return Observable.throw('Something went wrong');
      }
      );
  }

//  editResource(oldName: string, newName: string) {
  editResource(resName: string, resLabel: string,
    resType: string, resUrl: string, locationLatitude: number,
    locationLongitude: number, adapterType: string, maxResults: number,id: string,rowdata) {
  const formData = new FormData();
    // Attach data 
    let  req ;
      console.log("Test " + String(locationLongitude) + "," + String(locationLatitude))
    switch (resType) {
      case 'link':    
       req = { 'name': resName, 'label': resLabel, 'longitude': String(locationLongitude),'latitude': String(locationLatitude), 'url': (resUrl)};
        break;
      case 'contentfeed':
        req = { 'name': resName, 'label': resLabel, 'longitude': String(locationLongitude),'latitude': String(locationLatitude), "adapterType": adapterType,"query": resLabel,"maxResults": String(maxResults)};
        break;
      default:
       req = { 'name': resName, 'label': resLabel, 'longitude': String(locationLongitude),'latitude': String(locationLatitude)};
        console.log("Invalid Resource type @ updating resource")
        break;
    }

    let headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });

    return this.http.put(`${this.baseUrl}/resources/${id}`,
      req, options)
      .map(
      (response: Response) => {
        const data = response.json();
        this.deleteRowEmitter.emit(rowdata);
        this.addRowEmitter.emit(data);
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
}