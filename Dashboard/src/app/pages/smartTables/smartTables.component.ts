import { Component } from '@angular/core';
import { Response } from '@angular/http';
import { SmartTablesService } from './smartTables.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'smart-tables',
  templateUrl: './smartTables.html',
  styleUrls: ['./smartTables.scss']
})
export class SmartTables {
  servers = [];
  constructor(private smartTablesService: SmartTablesService) {
    this.onGet();
  }
  data = [];
  query: string = '';

  settings = {
    // TODO: Enable these *EVENTUALLY*
    // add: {
    //   addButtonContent: '<i class="ion-ios-plus-outline"></i>',
    //   createButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="ion-edit"></i>',
    //   saveButtonContent: '<i class="ion-checkmark"></i>',
    //   cancelButtonContent: '<i class="ion-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="ion-trash-a"></i>',
    //   confirmDelete: true
    // },
    actions: false,
    columns: {
      name: {
        title: 'Name'
      },
      createdBy: {
        title: 'Created By'
      },
      createdOn: {
        title: 'Created On',
        valuePrepareFunction: (createdOn)=> {
          return new Date(createdOn.$date).toString();
        }

      }
    }
  };

  source: LocalDataSource = new LocalDataSource();
  onGet() {
    this.smartTablesService.getServers()
      .subscribe(
        (servers: any[]) => {this.source.load(servers);
          console.log("Got these servers " + servers);},
        (error) => {console.log(error);}
      );
  }
  // constructor(protected service: SmartTablesService) {
  //   this.onGet();
  // }

  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
}
