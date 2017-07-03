import { Component, ViewChild } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { NgForm } from '@angular/forms';
import { NgUploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  metricsTableData1: Array<any>;
  arrayOfKeys = [];
  public defaultPicture = 'assets/img/theme/upload.jpg';
  public profile: any = {
    picture: 'assets/img/theme/upload.jpg'
  };

  constructor(private dashboardService: DashboardService) {
    this.myFunc();
    this.showRetrainingInfo();
    this.showBackendVersion();
  }

  public uploaderOptions: NgUploaderOptions = {
    url: '',
  };

  file: File;
  version = '';
  training_time = '';
  training_duration = '';
  num_labels = '';
  num_images = '';
  repoVersion = '';

  postResources(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.dashboardService.uploadRes(files[0])
      .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
      );
  }

  //Retrain
  retrainModal() {
    this.dashboardService.retrain()
      .subscribe((response) => {
        console.log("Got " + response);
      },
      (error) => { console.log(error); }
      );
  }

  onChange(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.file = files[0];
    this.doAnythingWithFile();
  }

  doAnythingWithFile() {
    this.dashboardService.upload(this.file)
      .subscribe(
      (response) => {
        this.arrayOfKeys = Object.keys(response);
        console.log(response.constructor.name);
        this.metricsTableData1 = response;
      },
      (error) => console.log(error)
      );
  }


  myFunc() {
    this.dashboardService.showVersion()
      .subscribe(
      (version: any) => { this.version = version; },
      (error) => console.log(error)
      );
  }

  showRetrainingInfo() {
    this.dashboardService.showRetrainingInfo()
      .subscribe(
      (response) => { //console.log("Version : " + response.training_time); 
        console.log(response.training_time);
        this.training_time = response.training_time.slice(0, 19);
        this.training_duration = response.training_duration;
        this.num_labels = response.num_labels[1];
        this.num_images = response.num_images;
      },
      (error) => console.log(error)
      );
  }

  showBackendVersion() {
    this.dashboardService.showRepoVersion()
      .subscribe(
      (response) => {
        this.repoVersion = response.version;
      },
      (error) => console.log(error)
      );
  }

}