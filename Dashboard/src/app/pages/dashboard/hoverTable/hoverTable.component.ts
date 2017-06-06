import {Component} from '@angular/core';

import {DashboardService} from '../dashboard.service';

@Component({
  selector: 'hover-table',
  templateUrl: './hoverTable.html'
})
export class HoverTable {

  metricsTableData:Array<any>;

  constructor(private _dashboardService: DashboardService) {
    //this.metricsTableData = _dashboardService.metricsTableData;
  }
  // update(arr: any[]){
  //   this.metricsTableData = arr;
  //   console.log("in update");
  // }
}
