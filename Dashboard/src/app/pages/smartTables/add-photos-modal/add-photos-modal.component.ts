import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SmartTablesService } from '../smartTables.service';


@Component({
  selector: 'app-add-photos-modal',
  templateUrl: './add-photos-modal.component.html',
  styleUrls: ['./add-photos-modal.component.scss']
})
export class AddPhotosModalComponent implements OnInit {
  // addPhotosLabel
    modalHeader: string;
  label: string = "";
  filesList: File[] = [];

  constructor(private stService: SmartTablesService, private activeModal: NgbActiveModal) {  }
  onModalLaunch(rowData) {
    this.label = rowData.name;
  }
    onLabel(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.filesList = [];
    for (var i = 0; i < files.length; i++) {
      this.filesList.push(files[i]);      
    }
  }
  ngOnInit() {
  }
  areTherePhotos(){
    return this.filesList.length > 0;
  }
  submitPhotos(){
    this.closeModal();
    this.stService.addPhotosLabel(this.label, this.filesList)
      .subscribe(
      (response) => {
        console.log(response);
        alert("Saved");
      },
      (error) => console.log(error)
      );
  }
    closeModal() {
    this.activeModal.close();
  }

}
