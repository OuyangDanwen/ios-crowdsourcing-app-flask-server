import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser'
import { DomSanitizer } from '@angular/platform-browser';
import { ResourcesService } from '../resources.service';

@Component({
  selector: 'view-resource-modal',
  styleUrls: [('./view-resource-modal.component.scss')],
  templateUrl: './view-resource-modal.component.html'
})

export class ViewResourceModalComponent implements OnInit {
  resType: string = "";
  baseURL: string = 'http://54.93.252.106:8080/api/resources/';
  htmlContent: string = "";
  resourceURL;
  modalHeader: string = "";

  constructor(private activeModal: NgbActiveModal, private domSanitizer: DomSanitizer,
    private resourcesService: ResourcesService) { }
  ngOnInit() { }

  onModalLaunch(rowData) {
    console.log(rowData._id.$oid);
    this.modalHeader += `${rowData._cls.substring(9)}: ${rowData.name}`;
    switch (rowData._cls) {
      case 'Resource.PDFDocument':
        this.resType = "pdf";
        break;
      case 'Resource.Text':
        this.resType = "text";
        break;
      case 'Resource.Video':
        this.resType = "video";
        break;
      case 'Resource.Audio':
        this.resType = "audio";
        break;
      case 'Resource.Link':
        this.resType = "link";
        this.htmlContent = `<b>URL:</b> <a href="${rowData.url}">${rowData.url}</a>`;
        return;
      case 'Resource.ContentFeed':
        this.resType = "contentfeed";
        this.modalHeader += ` (${rowData.adapterType})`
        this.getHtmlForContentFeed(rowData._id.$oid);
        return;
      default:
        this.modalHeader = 'Invalid resource type';
        console.log(this.modalHeader);
        return;
    }
    console.log("Resource type: " + this.resType);
    this.resourceURL = this.domSanitizer.
      bypassSecurityTrustResourceUrl(this.baseURL + rowData._id.$oid);
  }

  getHtmlForContentFeed(name) {
    this.resourcesService.getContentFeed(name)
      .subscribe(
      (content: any) => {
        console.log(content);
        if (!content.items || !content.items[0].div) {
          console.log("HTML is not properly formatted for this resource!");
          return;
        }
        content.items.forEach(element => {
          this.htmlContent += element.div;
        });
      },
      (error) => { console.log(error); }
      );
  }

  closeModal() {
    this.activeModal.close();
  }
}