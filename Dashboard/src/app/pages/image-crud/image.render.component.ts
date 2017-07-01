
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ViewPhotosModalComponent } from './view-photos-modal/view-photos-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <img (click)="launchViewModal()" [src]="imgSrc" style="max-width:50px;max-height:50px;"/>
  `,
})
export class ImageRenderComponent implements OnInit {

  imgSrc;

  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.imgSrc = this.value;
  }
  launchViewModal(){
    const activeModal = this.modalService.open(ViewPhotosModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Add Photos';
    activeModal.componentInstance.onModalLaunch(this.imgSrc);
  }
  

}