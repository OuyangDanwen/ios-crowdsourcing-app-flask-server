import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditResourceModalComponent } from './edit-resource-modal/edit-resource-modal.component';
import { DeleteResourceModalComponent } from './delete-resource-modal/delete-resource-modal.component';


@Component({
  template: `
  <i (click)="launchEditModal()" class="ion-edit"></i>
  <i (click)="launchDeleteModal()" class="ion-trash-a"></i>
   `,
})
export class ActionRenderComponent implements OnInit {

  rowData;

  @Input() value;

  constructor(private modalService: NgbModal) { 
  }



  ngOnInit() {
    this.rowData = this.value;
  }

  launchEditModal() {
    const activeModal = this.modalService.open(EditResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Edit Resource';
    console.log(this.rowData);
    activeModal.componentInstance.onModalLaunch(this.rowData);
  }
  launchDeleteModal() {
    const activeModal = this.modalService.open(DeleteResourceModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Delete Resource';
    activeModal.componentInstance.onModalLaunch(this.rowData);

  }
}