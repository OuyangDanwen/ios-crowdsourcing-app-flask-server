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
export class SmartTables {

  constructor(private smartTablesService: SmartTablesService, private modalService: NgbModal) {
    this.fillTable();
  }
  data = [];

  settings = {
    mode: 'inline',
    actions: false,
    pager: {
      display: true,
      perPage: 50,
    },
    columns: {
      name: {
        title: 'Name',
        width: '10%',
        hideSubHeader: true,
      },
      images: {
        title: 'Images',
        editable: false,
        width: '1%',
        type: 'html',
        valuePrepareFunction: (cell, row) => { 
          return `<a href="/#/pages/images?label=${row.name}">${row.images}</a>`; 
        }
      },
      resources: {
        title: 'Resources',
        editable: false,
        width: '1%',
        type: 'html',
        valuePrepareFunction: (cell, row) => { 
          return `<a href="/#/pages/resources?label=${row.name}">${row.resources}</a>`; 
        }
      },
      createdBy: {
        title: 'Created By',
        width: '5%',
        editable: false,
      },
      createdOn: {
        title: 'Created On',
        width: '10%',
        editable: false,
        filter: false,
        valuePrepareFunction: (createdOn) => {
          let dt = new Date(createdOn.$date);
          let formattedDate = moment(dt).format('Do MMMM YYYY, h:mm:ss a');
          return formattedDate;
        },
      },
      actions: {
        title: 'Actions',
        type: 'custom',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (cell, row) => row,
        width: '10%',
        align: 'center',
        filter: false,
        hideSubHeader: true,
      },
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
