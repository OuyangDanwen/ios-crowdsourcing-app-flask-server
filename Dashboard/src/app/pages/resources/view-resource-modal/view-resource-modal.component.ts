import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-resource-modal',
  styleUrls: [('./view-resource-modal.component.scss')],
  templateUrl: './view-resource-modal.component.html'
})

export class ViewResourceModalComponent implements OnInit {

  modalHeader: string;
  modalContent: string = `Saved Successfully`;

  constructor(private activeModal: NgbActiveModal) {}
  
  onModalLaunch(rowData) {
    console.log(rowData);
  }

  ngOnInit() { }

  closeModal() {
    this.activeModal.close();
  }
}