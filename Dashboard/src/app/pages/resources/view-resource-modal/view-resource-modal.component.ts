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
  isVideo: boolean = false;
  isPDF: boolean = false;
  isAudio: boolean = false;
  baseURL: string = 'http://54.93.252.106:8080/api/resources/';
  resourceURL;
  modalHeader: string;

  constructor(private activeModal: NgbActiveModal, private domSanitizer : DomSanitizer) {}
  
  onModalLaunch(rowData) {
    console.log(rowData);
    if (rowData._cls == 'Resource.PDFDocument') {
      console.log('Found the Document');
      this.isPDF = true;
    }
    else if (rowData._cls == 'Resource.Video') {
      console.log('Found the Video');
      this.isVideo = true;
    }
    else if (rowData._cls == 'Resource.Audio') {
      console.log('Found the Audio');
      this.isAudio = true;
    }
    else {
      this.modalHeader = 'Invalid resource extenstion (only mp3/pdf/mp4 supported)';
      console.log(this.modalHeader);
      return;
    }
    this.resourceURL = this.domSanitizer.
    bypassSecurityTrustResourceUrl(this.baseURL + rowData.name);
  }

  ngOnInit() { }

  closeModal() {
    this.activeModal.close();
  }
}