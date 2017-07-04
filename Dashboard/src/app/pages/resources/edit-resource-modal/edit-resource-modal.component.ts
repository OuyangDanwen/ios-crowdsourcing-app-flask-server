import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';

@Component({
  selector: 'app-edit-resource-modal',
  templateUrl: './edit-resource-modal.component.html',
  styleUrls: ['./edit-resource-modal.component.scss'],
})
export class EditResourceModalComponent implements OnInit {
  oldName: string = "";
  newName: string = "";
  label: string = "";
  rowData;
  modalHeader: string;

  constructor(private stService: ResourcesService, private activeModal: NgbActiveModal) { }

  ngOnInit() {}

  onModalLaunch(rowData) {
    this.oldName = rowData.name;
    this.newName = rowData.name;
    this.label = rowData.label;
    console.log(this.oldName);
  }

  updateResource() {
    this.stService.editResource(this.oldName, this.newName)
      .subscribe(
      (response) => {
        console.log(response);
        setTimeout(() => { this.closeModal(); }, 2000);
      },
      (error) => console.log(error)
      );
  }

  isLabelValid() {
    return this.newName.length > 3;
  }

  closeModal() {
    this.activeModal.close();
  }

}
