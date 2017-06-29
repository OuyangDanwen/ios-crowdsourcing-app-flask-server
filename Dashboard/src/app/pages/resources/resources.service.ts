import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions  } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class ResourcesService {
  constructor(private http: Http) { }
    getResources() {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);
    return this.http.get('http://54.93.252.106:8080/api/resources', { headers: headers })
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

    deleteResource(label,name) {
    const token = localStorage.getItem('access_token');
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token); 
    console.log('hehehe'+label+name);

    return this.http.delete('http://54.93.252.106:8080/api/resources/'+name,{ headers: headers })
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

    uploadResource(resName: string, resLabel: string, resType: string, resUrl: string, file: File) {
    const formData = new FormData();
    // Attach data 
    formData.append("name", resName);
    formData.append("type", resType);
    formData.append("label", resLabel);
  
    // console.log("\n\n\ TSTST: " + resType.toLowerCase());
    switch (resType) {
      case 'link':
        formData.append("url",encodeURI(resUrl));
        break;
      case 'audio':
      case 'video':
      case 'document':
        formData.append("file", file);      
        formData.append("size", String(file.size));
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

console.log(formData);
console.log(options);
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
        return Observable.throw('Something went wrong');
      }
      );
  }

    editResource(oldName: string, newName: string) {
      console.log(oldName);
      console.log(newName);
    const req = { "name": oldName, "newname": newName};
    let headers = new Headers({ 'Content-Type': 'application/json' });
    const token = localStorage.getItem('access_token');
    headers.append('Authorization', 'Bearer ' + token);
    let options = new RequestOptions({ headers: headers });    

    return this.http.put('http://54.93.252.106:8080/api/resources/',
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
}