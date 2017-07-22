import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ResourcesService } from '../resources.service';
import { AgmCoreModule } from '@agm/core';

@Component({
  selector: 'app-edit-resource-modal',
  templateUrl: './edit-resource-modal.component.html',
  styleUrls: ['./edit-resource-modal.component.scss'],
})
export class EditResourceModalComponent implements OnInit {
  contentFeedTypes: string[] = [
    "Google",
    "Weather"
  ];
  oldName: string = "";
  newName: string = "";
  label: string = "";
  id: string = "";
  rowdata;
  modalHeader: string;

  isEmpty: boolean;
  isLink: boolean = false;
  isContentFeed: boolean = false;
  
  resType: string = "Link";
  adapterType: string = "Google";
  maxResults: number = 0;
  url: string = "";
  
  locationLatitude: number = 0;
  locationLongitude: number = 0;
  locationLatitudeCurrentLocation: number = 0;
  locationLongitudeCurrentLocation: number = 0;
  
  //errors
  isLatInvalid: boolean = false;
  isLongInvalid: boolean = false;
  isResultInvalid: boolean = false;
  isTextInvalid: boolean = false;
  isURLInvalid: boolean = false;
  
  isWeather: boolean = false;
  isGoogle: boolean = false;
  
  // initial center position for the map
  setPosition(position: Position) {
    this.locationLatitudeCurrentLocation = position.coords.latitude;
    this.locationLongitudeCurrentLocation = position.coords.longitude;
  }

  constructor(private stService: ResourcesService, private activeModal: NgbActiveModal) { }

  ngOnInit() {}

  onModalLaunch(rowData) {
  this.rowdata=rowData;
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
    };
    this.oldName = rowData.name;
    this.newName = rowData.name;
    this.locationLatitude = rowData.location.coordinates[0];
    this.locationLongitude = rowData.location.coordinates[1];
    this.resType = rowData._cls;
    this.isWeather= false;
    this.isGoogle= false;
    this.id = rowData._id.$oid;
    this.label = rowData.label;    
      if(this.resType === "Resource.Link"){
        this.resType = "Link";
        this.isLink = true;
        this.url = rowData.url;
      }else if(this.resType === "Resource.ContentFeed"){
        this.resType = "ContentFeed";
        this.isContentFeed = true;
        this.adapterType = rowData.adapterType;
        if(this.adapterType === "google"){
          this.isWeather= false;
          this.isGoogle= true;
        }else if(this.adapterType === "weather"){
          this.isWeather= true;
          this.isGoogle= false;
        }  
        this.maxResults = rowData.maxResults;
      }
  }


  onSelectContentFeedChange(value) {
    this.adapterType = value;
  }

  onchangeLatitude(Latitude){
    if( Latitude === null || !(Latitude >= -90 && Latitude <= 90) || !(this.isValidCoordinate(Latitude)) ){
        this.isLatInvalid = true;
      }else{
        this.isLatInvalid = false; 
      }
  }

  onchangeLongitude(Longitude){
    if( Longitude === null || !(Longitude >= -180 && Longitude <= 180) || !(this.isValidCoordinate(Longitude)) ){
      this.isLongInvalid = true;
    }else{
      this.isLongInvalid = false; 
    }
  }

  onChangeResultvalues(value){
   if(value<=0 || value>=11){
      this.isResultInvalid = true;
   }else{
      this.isResultInvalid = false;
   }
  }

  onChangeURLText(value){
   if(value.length <= 0){
      this.isURLInvalid = true;
   }else{
      this.isURLInvalid = false;
   }
  }

  onChangeNameText(value){
   if(value.length <= 0){
      this.isTextInvalid = true;
   }else{
      this.isTextInvalid = false;
   }
  }


  isValidCoordinate(coordinate: number) {
    if (coordinate != 0 && ((coordinate % 1 === 0) ||
      (coordinate === +coordinate && coordinate !== (coordinate | 0)))) {
      return true;
    }
    return false;
  }


  updateResource() {
    console.log(this.newName);
    console.log(this.id);
//  this.stService.editResource(this.id, this.newName)
    this.stService.editResource(this.newName.toLowerCase(),this.label,
        this.resType.toLowerCase(), this.url, this.locationLatitude,
        this.locationLongitude, this.adapterType.toLowerCase(), this.maxResults, this.id, this.rowdata)
      .subscribe(
      (response) => {
        console.log(response);
        setTimeout(() => { this.closeModal(); }, 2000);
      },
      (error) => console.log(error)
      );
  }

  isLabelValid() {
    if( !this.isLatInvalid && !this.isLongInvalid && !this.isResultInvalid && !this.isTextInvalid && !this.isURLInvalid && this.newName.length > 0){
        return false;
    }
    return true;
  }

  closeModal() {
    this.activeModal.close();
  }

}
