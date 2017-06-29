import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'save-label-modal',
  styleUrls: [('./save-label-modal.component.scss')],
  templateUrl: './save-label-modal.component.html'
})

export class SaveLabelModalComponent implements OnInit {

  modalHeader: string;
  modalContent: string = `Saved Successfully`;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {}

  closeModal() {
    this.activeModal.close();
  }
  
}