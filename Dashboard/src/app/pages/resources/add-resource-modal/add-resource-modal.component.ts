import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveResourceModalComponent } from '../save-resource-modal/save-resource-modal.component';


@Component({
  selector: 'add-resource-modal',
  templateUrl: './add-resource-modal.component.html',
  styleUrls: ['./add-resource-modal.component.scss']
})
export class AddResourceModalComponent implements OnInit {
  resourceTypes: string[] = [
    "Link",
    "Document",    
    "Audio",
    "Video"
  ];
  isLink: boolean = true;
  modalHeader: string;
  resType: string = "Link";
  labelTxt: string = "";
  url: string = "";
  files: FileList; 
  filesLst: File[] = [];
  resName: string = "";
  resFile: File = null;

  constructor(private resourcesService: ResourcesService, private activeModal: NgbActiveModal,private modalService: NgbModal) {
  }
  
  ngOnInit() {}

  onSelectChange(value){
    if(value === "Link"){
      console.log("Found the link");
      this.isLink = true;
      this.resFile = null;
    }
    else{
      this.isLink = false;
    }
    this.resType = value;
    console.log("New value" + value);
  }

  //Batch uploading
  onLabel(event: EventTarget) {
    let eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    let target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    let files: FileList = target.files;
    this.resFile = files[0];
  }

  setLabel(labelTxt: string) {
    this.labelTxt = labelTxt;
    this.closeModal();
    this.resourcesService.uploadResource(this.resName.toLowerCase(), this.labelTxt.toLowerCase(), this.resType.toLowerCase(), this.url, this.resFile)
      .subscribe(
      (response) => {
        console.log(response);
        this.lgModalShow();
      },
      (error) => console.log(error)
      );
  }

  closeModal() {
    this.activeModal.close();
  }
  disableButton(){
    if (this.resName.length > 0 && this.labelTxt.length > 0){
      if ((this.resType === "Link" && this.url.length > 0) || (this.resFile)){
      return false;

      }
    }
    
    return true;
  }

  //save success modal
    lgModalShow() {
    const activeModal = this.modalService.open(SaveResourceModalComponent, {size: 'sm'});
    activeModal.componentInstance.modalHeader = '';
  }
}