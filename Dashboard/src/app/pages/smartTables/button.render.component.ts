
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLabelModalComponent } from './edit-label-modal/edit-label-modal.component';
import { DeleteLabelModalComponent } from './delete-label-modal/delete-label-modal.component';
import { AddPhotosModalComponent } from './add-photos-modal/add-photos-modal.component';

@Component({
  template: `
  <i (click)="launchEditModal()" class="ion-edit"></i>
  <i (click)="launchDeleteModal()" class="ion-trash-a"></i>
  <i (click)="launchPicturesModal()" class="ion-images"></i>
  `,
})
export class ButtonRenderComponent implements OnInit {

  rowData;

  @Input() value;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    this.rowData = this.value;
  }

  launchEditModal() {
    const activeModal = this.modalService.open(EditLabelModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Edit Label';
    // Pass data to modal
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }
  launchDeleteModal() {
    const activeModal = this.modalService.open(DeleteLabelModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Delete Label';
    activeModal.componentInstance.onModalLaunch(this.rowData);

  }
  launchPicturesModal() {
    const activeModal = this.modalService.open(AddPhotosModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Add Photos';
    activeModal.componentInstance.onModalLaunch(this.rowData);

  }
}