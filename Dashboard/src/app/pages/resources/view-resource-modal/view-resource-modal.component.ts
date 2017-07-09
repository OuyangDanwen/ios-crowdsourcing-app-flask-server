import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
  @ViewChild('d1') d1:ElementRef;
  resType: string = "";
  baseURL: string = 'http://54.93.252.106:8080/api/resources/';
  htmlContent: string = "";
  resourceURL;
  modalHeader: string;

  constructor(private activeModal: NgbActiveModal, private domSanitizer: DomSanitizer,
    private resourcesService: ResourcesService, private renderer:Renderer2) { }
  ngOnInit() { }

  onModalLaunch(rowData) {
    switch (rowData._cls) {
      case 'Resource.PDFDocument':
        this.resType = "pdf";
      case 'Resource.Video':
        this.resType = "video";
      case 'Resource.Audio':
        this.resType = "audio";
        break;
      case 'Resource.Link':
        this.resType = "link";
        return;
      case 'Resource.ContentFeed':
        this.resType = "contentfeed";
        this.getHtmlForContentFeed(rowData.name);
        return;
      default:
        this.modalHeader = 'Invalid resource type';
        console.log(this.modalHeader);
        return;
    }
    console.log("Resource type: " + this.resType);
    this.resourceURL = this.domSanitizer.
      bypassSecurityTrustResourceUrl(this.baseURL + rowData.name);
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