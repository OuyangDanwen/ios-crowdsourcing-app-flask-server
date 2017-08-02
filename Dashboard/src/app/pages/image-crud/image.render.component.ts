
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ViewPhotosModalComponent } from './view-photos-modal/view-photos-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <img (click)="launchViewModal()" [src]="imgSrc" style="max-width:75px;max-height:75px;"/>
  `,
})

export class ImageRenderComponent implements OnInit {
  imgSrc;

  rowData;
  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.rowData = this.value;
    this.imgSrc = this.value.dp;
  }

  launchViewModal() {
    const activeModal = this.modalService.open(ViewPhotosModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Add Photos';
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }
}