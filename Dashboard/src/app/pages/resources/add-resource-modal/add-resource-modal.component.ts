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
    "Video",
    "Contentfeed"
  ];
  contentFeedTypes: string[] = [
    "Google",
    "Weather"
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
  isContentFeed: boolean = false;
  adapterType: string = "Google";
  maxResults: number = 3;
  notLinkAndContentfeed: boolean = false;
  locationLatitude: number = 0;
  locationLongitude: number = 0;

  constructor(private resourcesService: ResourcesService, private activeModal: NgbActiveModal,private modalService: NgbModal) {
  }
  
  ngOnInit() {}

  onSelectContentFeedChange(value){
    this.adapterType = value;
    console.log("New value" + this.adapterType);
    console.log("New value" + value);
  }

  onSelectChange(value){
    console.log("before notLinkAndContentfeed " + this.notLinkAndContentfeed);

    if(!(value === "Link") && !(value === "Contentfeed")){
      this.notLinkAndContentfeed = true;
    }else{
      this.notLinkAndContentfeed = false;
    }

    console.log("After selection notLinkAndContentfeed " + this.notLinkAndContentfeed);

    if(value === "Link"){
      console.log("Found the link");
      this.isLink = true;
      this.notLinkAndContentfeed = false;
      this.resFile = null;
    }
    else{
      this.isLink = false;
    }

    if(value === "Contentfeed"){
      console.log("Found the isContentFeed");
      this.isContentFeed = true;
      this.notLinkAndContentfeed = false;
      this.resFile = null;
    }
    else{
      this.isContentFeed = false;
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
    this.resourcesService.uploadResource(this.resName.toLowerCase(), this.labelTxt.toLowerCase(), this.resType.toLowerCase(), this.url, this.resFile, this.locationLatitude, this.locationLongitude, this.adapterType, this.maxResults)
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


  isValidCoordinate(coordinate: number){
    debugger;
    if( coordinate!=0 && ( (coordinate % 1 === 0) || (coordinate === +coordinate && coordinate!== (coordinate|0)) ) ){
      return true;
    }
    return false;
  }

  disableButton(){
  debugger;

    if (this.resName.length > 0 && this.labelTxt.length > 0 && this.isValidCoordinate(this.locationLatitude) && this.isValidCoordinate(this.locationLongitude) ){
      debugger;
      if ((this.resType === "Link" && this.url.length > 0) || (this.resFile) || (this.resType === "Contentfeed" && (this.maxResults > 0 && this.maxResults < 11) && (this.adapterType === "Google" || this.adapterType === "Weather") ) ) {
        console.log("best best");
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