import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'view-resource-modal',
  styleUrls: [('./view-resource-modal.component.scss')],
  templateUrl: './view-resource-modal.component.html'
})

export class ViewResourceModalComponent implements OnInit {
  resType: string = "";
  baseURL: string = 'http://54.93.252.106:8080/api/resources/';
  resourceURL;
  modalHeader: string;

  constructor(private activeModal: NgbActiveModal, private domSanitizer : DomSanitizer) {}
  
  onModalLaunch(rowData) {
    console.log(rowData);
    if (rowData._cls == 'Resource.PDFDocument') {
      this.resType = "pdf";
    }
    else if (rowData._cls == 'Resource.Video') {
      this.resType = "video";
    }
    else if (rowData._cls == 'Resource.Audio') {
      this.resType = "audio";
    }
    else if (rowData._cls == 'Resource.Url'){
      this.resType = "url";
      return;
    }
    else if (rowData._cls == 'Resource.ContentFeed'){
      this.resType = "contentfeed"
      return;
    }
    else {
      this.modalHeader = 'Invalid resource extenstion (only mp3/pdf/mp4 supported)';
      console.log(this.modalHeader);
      return;
    }
    console.log("Resource type: " + this.resType);
    this.resourceURL = this.domSanitizer.
    bypassSecurityTrustResourceUrl(this.baseURL + rowData.name);
  }

  ngOnInit() { }

  closeModal() {
    this.activeModal.close();
  }
}