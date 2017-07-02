import { Component, NgModule, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { ImageCrudService } from './image-crud.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { DeleteButtonRenderComponent } from './del.button.render.component';
import { ImageRenderComponent } from './image.render.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-image-crud',
  templateUrl: './image-crud.component.html',
  styleUrls: ['./image-crud.component.scss']
})
export class ImageCrudComponent implements OnInit {

  constructor(private imgService: ImageCrudService, private modalService: NgbModal, private activatedRoute: ActivatedRoute) {
    this.fillTable();
  }
  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        const filter: string = params['label'];
        console.log(filter);        
        if (filter){
          this.source.setFilter([{ field: 'label', search: filter }]);
        }
      });
  }
    data = [];
  query: string = '';
  settings = {
    mode: 'inline',
    actions: false,
    pager: {
      display: true,
      perPage: 50
    },
    columns: {
      dp: {
      title: 'Display Picture',
      filter: false,
      type: 'custom',
      renderComponent: ImageRenderComponent,
    },
    label: {
        title: 'Label',
        editable: false,
      },
      createdBy: {
        title: 'Created By',
        editable: false,
      },
      createdOn: {
        title: 'Created On',
        filter: false,
        editable: false,
        valuePrepareFunction: (createdOn) => {
          var dt = new Date(createdOn.$date);
          var formattedDate = moment(dt).format('Do MMMM YYYY, h:mm:ss a');
          return formattedDate;
        },
      },
       actions: {
        title: 'Actions',
        type: 'custom',
        renderComponent: DeleteButtonRenderComponent,
        filter: false,
        width: '10%',
        hideSubHeader: true
      },
    }    
  };

  source: LocalDataSource = new LocalDataSource();

  fillTable() {
    this.imgService.getImages()
      .subscribe(
      (labels: any[]) => {
        for (var i = 0; i < labels.length; i++) {
        labels[i].dp = `http://54.93.252.106:8080/api/images/${labels[i].label}/${labels[i].name}`;
        labels[i].actions = labels[i].dp;
        }
        this.source.load(labels);
      },
      (error) => { console.log(error); }
      );
  }
}
