import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveResourceModalComponent } from '../save-resource-modal/save-resource-modal.component';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";

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
  labelName = [];
  resName: string = "";
  resFile: File = null;
  isContentFeed: boolean = false;
  adapterType: string = "Google";
  maxResults: number = 3;
  notLinkAndContentfeed: boolean = false;
  locationLatitude: number = 0;
  locationLongitude: number = 0;
  locationLatitudeCurrentLocation: number = 0;
  locationLongitudeCurrentLocation: number = 0;

  setPosition(position: Position){
  debugger;
      this.locationLatitude = position.coords.latitude;
      this.locationLongitude = position.coords.longitude;
      this.locationLatitudeCurrentLocation = position.coords.latitude;
      this.locationLongitudeCurrentLocation = position.coords.longitude;

    }

  constructor(private resourcesService: ResourcesService, private activeModal: NgbActiveModal,private modalService: NgbModal) {
      this.loadLabels();
   }


   onModalLaunch() {
   debugger;
      if(navigator.geolocation){
         navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
      };
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

  setLabel() {
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

  //Load label name
   loadLabels() {
    this.resourcesService.getLabels()
      .subscribe(
      (labels: any[]) => {
        for(var i=0;i<labels.length;i++) {
          this.labelName[i]=labels[i].name;
        }
      },
      (error) => { console.log(error); },
    );
  }

 //autocomplete check
  labelChanged(newVal) {
    this.labelTxt = newVal ;
  }

  isValidCoordinate(coordinate: number){
    if( coordinate!=0 && ( (coordinate % 1 === 0) || (coordinate === +coordinate && coordinate!== (coordinate|0)) ) ){
      return true;
    }
    return false;
  }

  isValidLatitudeLongitude(Latitude: number,Longitude: number){
    debugger;
    if(this.locationLongitudeCurrentLocation == Longitude && this.locationLatitudeCurrentLocation==Latitude){
    return true;
    }

    if( (Latitude>=-90 && Latitude<=90) && (Longitude>=-180 && Longitude<=180) && this.isValidCoordinate(Latitude) && this.isValidCoordinate(Longitude)){
      return true;
    }
    return false;
  }
  disableButton(){


    if (this.resName.length > 0 && this.labelTxt.length > 0 && this.isValidLatitudeLongitude(this.locationLatitude,this.locationLongitude)){
      if ((this.resType === "Link" && this.url.length > 0) || (this.resFile) || (this.resType === "Contentfeed" && (this.maxResults > 0 && this.maxResults < 11) && (this.adapterType === "Google" || this.adapterType === "Weather") ) ) {
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