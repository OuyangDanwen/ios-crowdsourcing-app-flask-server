import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartTablesService } from '../smartTables.service';

@Component({
  selector: 'app-delete-label-modal',
  templateUrl: './delete-label-modal.component.html',
  styleUrls: ['./delete-label-modal.component.scss'],
})
export class DeleteLabelModalComponent implements OnInit {
  modalHeader: string;
  tt: number = 0;
  label: string = '';
  id: string;
  safeGuard: boolean = false;
  safeGuardInput: string = '';
  numImages: number = 0;
  numResources: number = 0;
  warningMessages: string[];
  constructor(private stService: SmartTablesService, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  safeGuardCheck() {
    return this.safeGuardInput === this.label;
  }

  onModalLaunch(rowData) {
    this.label = rowData.name;
    this.id = rowData._id.$oid;
    this.numImages = rowData.images;
    this.numResources = rowData.resources;
    this.warningMessages = [
      `Are you sure? This can't be undone!`,
      `Deleting this label would also delete ${this.numImages} photos, and ${this.numResources} resources attached. Are you absolutely sure?`,
      `Successfully deleted label!`,
    ];
    console.log(this.numResources);
  }

  inc() {
    if (this.safeGuardCheck) {
      this.safeGuard = true;
      this.tt += 1;
      if (this.tt === 2) {
        this.stService.deleteLabel(this.id)
          .subscribe(
          (response) => {
            console.log(response);
            setTimeout(() => { this.closeModal(); }, 2000);
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
