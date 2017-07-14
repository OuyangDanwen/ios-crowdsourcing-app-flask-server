import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';

@Component({
  selector: 'app-delete-resource-modal',
  templateUrl: './delete-resource-modal.component.html',
  styleUrls: ['./delete-resource-modal.component.scss'],
})
export class DeleteResourceModalComponent implements OnInit {
  row: any = null;
  modalHeader: string;
  tt: number = 0;
  label: string = '';
  name: string = '';
  id : string = '';
  safeGuard: boolean = false;
  safeGuardInput: string = '';
  numImages: number = 0;
  numResources: number = 0;
  warningMessages : string [];
  constructor(private stService: ResourcesService, private activeModal: NgbActiveModal) {}

  ngOnInit() {
  }

  safeGuardCheck() {
    if (this.safeGuardInput === this.label) {
      return true;
    }
    return false;
  }

  onModalLaunch(rowData) {
    this.row = rowData;
    console.log(rowData);
    this.label = rowData.label;
    this.name = rowData.name;
    this.id = rowData._id.$oid;
    console.log(this.id);
    this.warningMessages = [
    `Are you sure? This can't be undone!`,
    `Are you absolutely sure?`,
    `Successfully deleted resource!`,
  ];
  }

  inc() {
    if (this.safeGuardCheck) {
      this.safeGuard = true;
      this.tt += 1;
      if (this.tt === 2) {
        this.stService.deleteResource(this.row)
        .subscribe(
        (response) => {
          console.log(response);
          setTimeout(() => {this.closeModal(); }, 1000);
        },
        (error) => console.log(error),
        );
      }
    }
  }

    closeModal() {
    this.activeModal.close();
  }

}
