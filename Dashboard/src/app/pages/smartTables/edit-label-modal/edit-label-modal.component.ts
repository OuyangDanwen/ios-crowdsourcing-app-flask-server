import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartTablesService } from '../smartTables.service';
@Component({
  selector: 'app-edit-label-modal',
  templateUrl: './edit-label-modal.component.html',
  styleUrls: ['./edit-label-modal.component.scss']
})
export class EditLabelModalComponent implements OnInit {
  oldLabel: string = "";
  newLabel: string = "";
  createdBy: string = "";
  id: string;
  rowData;
  modalHeader: string;

  constructor(private stService: SmartTablesService, private activeModal: NgbActiveModal) { }

  ngOnInit() { }

  onModalLaunch(rowData) {
    this.id = rowData._id.$oid;
    this.oldLabel = rowData.name;
    this.newLabel = rowData.name;
    this.createdBy = rowData.createdBy;
    console.log(this.oldLabel);
  }

  updateLabel() {
    this.stService.editLabel(this.newLabel, this.id)
      .subscribe(
      (response) => {
        console.log(response);
        setTimeout(() => { this.closeModal(); }, 2000);
      },
      (error) => console.log(error)
      );
  }
  isLabelValid() {
    return this.newLabel.length > 3;
  }
  closeModal() {
    this.activeModal.close();
  }
}
