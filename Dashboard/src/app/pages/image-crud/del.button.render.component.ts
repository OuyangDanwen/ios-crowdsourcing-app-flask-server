
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ViewPhotosModalComponent } from './view-photos-modal/view-photos-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <i (click)="launchDeleteModal()" class="ion-trash-a"></i>
  `,
})
export class DeleteButtonRenderComponent implements OnInit {

  imgSrc;

  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.imgSrc = this.value;
  }
  launchDeleteModal() {
    const activeModal = this.modalService.open(ViewPhotosModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Delete Photo';
    activeModal.componentInstance.onModalLaunch(this.imgSrc, "delete");
  }
}