import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ImageCrudService} from '../image-crud.service';
@Component({
  selector: 'app-view-photos-modal',
  templateUrl: './view-photos-modal.component.html',
  styleUrls: ['./view-photos-modal.component.scss']
})
export class ViewPhotosModalComponent implements OnInit {
  isView: boolean = false;
  isDelete: boolean = false;

  imgSrc: string = "";
    constructor(private activeModal: NgbActiveModal, private imgService: ImageCrudService) {  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  onModalLaunch(imgSrc, deld) {
    this.imgSrc = imgSrc;
    if(deld === "delete"){
      this.isDelete = true;
    }
    else{
      this.isView = true;
    }
  }
  deleteImage() {
    this.imgService.deleteImage(this.imgSrc)
      .subscribe(
      (response) => {
        console.log(response);
        console.log("Successfully deleted images");
        setTimeout(() => {this.closeModal(); }, 2000);
      },
      (error) => { console.log(error); }
      );

  }
}
