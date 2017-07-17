import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartTablesService } from '../smartTables.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveLabelModalComponent } from '../save-label-modal/save-label-modal.component';


@Component({
  selector: 'add-label-modal',
  styleUrls: [('./add-label-modal.component.scss')],
  templateUrl: './add-label-modal.component.html',
})

export class AddLabelModalComponent implements OnInit {
  modalHeader: string;
  labelTxt: string = "";
  files: FileList;
  filesLst: File[] = [];

  constructor(private stService: SmartTablesService,
    private activeModal: NgbActiveModal, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  //Batch uploading
  onLabel(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.filesLst = [];
    for (var i = 0; i < files.length; i++) {
      this.filesLst.push(files[i]);
    }
  }

  setLabel(labelTxt: string) {
    this.labelTxt = labelTxt;
    this.closeModal();
    this.stService.uploadFileLabel(this.labelTxt, this.filesLst)
      .subscribe(
      (response) => {
        console.log(response);
        this.lgModalShow();
      },
      (error) => console.log(error)
      );
  }

  getLabel() {
    return this.labelTxt;
  }
  isLabelValid() {
    return this.labelTxt.length > 3;
  }

  closeModal() {
    this.activeModal.close();
  }

  lgModalShow() {
    const activeModal = this.modalService.open(SaveLabelModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = '';
  }
}
