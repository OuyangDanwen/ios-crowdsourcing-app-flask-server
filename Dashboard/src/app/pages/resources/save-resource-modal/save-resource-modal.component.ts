import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'save-resource-modal',
  styleUrls: [('./save-resource-modal.component.scss')],
  templateUrl: './save-resource-modal.component.html'
})

export class SaveResourceModalComponent implements OnInit {

  modalHeader: string;
  modalContent: string = `Saved Successfully`;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
  }
}