import {Component, ViewChild} from '@angular/core';
import { DashboardService } from './dashboard.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  metricsTableData1:Array<any>;
  arrayOfKeys = [];

  constructor(private dashboardService: DashboardService) {}
  file: File;  
  file1: File;
  version = '';
  labelTxt: string;
  base64textString:string='';
  files: FileList; 
  
  onChange(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
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

   
   myFunc(){
     this.dashboardService.showVersion()
      .subscribe(
        (version: any) => {console.log("Version : " + version); this.version = version;},
        (error) => console.log(error)
      );
   }

//Batch uploading

onLabel(event: EventTarget) {
        let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
        let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
        let files: FileList = target.files;
        console.log(files.length);
        this.file1 = files[0];
        if (files && this.file1) {
        var reader = new FileReader();
        reader.onload =this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(this.file1);
    }
    }

    handleReaderLoaded(readerEvt) {
     var binaryString = readerEvt.target.result;
     this.base64textString= btoa(binaryString);
    }


   labelFile(tempString: string,base64textString: string) {
      this.dashboardService.uploadFileLabel(tempString,this.base64textString)
      .subscribe(
        (response) => {
          this.arrayOfKeys = Object.keys(response);
          console.log(response)
      },
        (error) => console.log(error)
      );
   }
setLabel(labelTxt: string) {
this.labelTxt = labelTxt;
this.labelFile(this.labelTxt,this.base64textString);
}

getLabel() {
  return this.labelTxt;
}
}
