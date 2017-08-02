
import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditLabelModalComponent } from './edit-label-modal/edit-label-modal.component';
import { DeleteLabelModalComponent } from './delete-label-modal/delete-label-modal.component';
import { AddPhotosModalComponent } from './add-photos-modal/add-photos-modal.component';

@Component({
  template: `
  <div style="text-align: center;" id="action-btn">
  <button class="btn btn-success btn-sm action-property" (click)="launchPicturesModal()" title="Add New Training Image"><i class="ion-images"></i>&nbsp;Add</button>
  <button class="btn btn-warning btn-sm action-property" (click)="launchEditModal()" title="Edit Label Name"><i class="ion-edit"></i>&nbsp;Edit</button> 
  <button class="btn btn-danger btn-sm action-property" (click)="launchDeleteModal()" title="Delete Label"><i class="ion-trash-a"></i>&nbsp;Delete</button>
  </div>
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