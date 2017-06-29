import { Component, NgModule, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { SmartTablesService } from './smartTables.service';
import { LocalDataSource } from 'ng2-smart-table';
import * as moment from 'moment';
import { ButtonRenderComponent } from './button.render.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddLabelModalComponent } from './add-label-modal/add-label-modal.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'smart-tables',
  templateUrl: './smartTables.html',
  styleUrls: ['./smartTables.scss'],
})
export class SmartTables{

  constructor(private smartTablesService: SmartTablesService, private modalService: NgbModal) {
    this.fillTable();
  }
  data = [];

  //Retrain
  // retrainModal() {
    // this.smartTablesService.retrain()
    // .subscribe((response) => {
        // console.log("Got " + response);
      // },
      // (error) => { console.log(error); }
      // );
  // }

  settings = {
    mode: 'inline',
    actions: false,
    // hideSubHeader: true,
    pager: {
      display: true,
      perPage: 50,
    },


    columns: {
      name: {
        title: 'Name',
        hideSubHeader: true,
      },
      images: {
        title: 'Images',
        editable: false,
        width: '10%',
        type: 'html',
        valuePrepareFunction: (cell, row) => { console.log(row);return `<a href="/#/pages/images?label=${row.name}">${row.images}</a>`; }
      },
      resources: {
        title: 'Resources',
        editable: false,
        width: '10%',
        type: 'html',
        valuePrepareFunction: (cell, row) => { console.log(row);return `<a href="/#/pages/resources?label=${row.name}">${row.resources}</a>`; }
      },
      createdBy: {
        title: 'Created By',
        editable: false,
      },
      createdOn: {
        title: 'Created On',
        editable: false,
        valuePrepareFunction: (createdOn) => {
          let dt = new Date(createdOn.$date);
          let formattedDate = moment(dt).format('Do MMMM YYYY, h:mm:ss a');
          // console.log(formattedDate);
          return formattedDate;
        },
      },
            actions: {
        title: 'Actions',
        type: 'custom',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (cell, row) => row,
        width: '80px',
        filter: false,
        hideSubHeader: true,
      },
    //       dp: {
    //   title: 'Display Picture',
    //   filter: false,
    //   type: 'custom',
    //   renderComponent: ImageRenderComponent
    //   // valuePrepareFunction: (dp) => { return `<img scr="dp" />`; }
    // },
    },
  };


  source: LocalDataSource = new LocalDataSource();
  fillTable() {
    this.smartTablesService.getLabels()
      .subscribe(
      (labels: any[]) => {
        this.source.load(labels);
      },
      (error) => { console.log(error); },
      );
  }

  launchAddModal() {
    const activeModal = this.modalService.open(AddLabelModalComponent, { size: 'sm' });
    activeModal.componentInstance.modalHeader = 'Add Label';
  }
}
