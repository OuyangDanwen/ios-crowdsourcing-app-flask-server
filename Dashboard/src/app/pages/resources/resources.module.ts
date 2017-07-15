import { NgModule,ApplicationRef, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';
import { routing } from './resources.routing';
import { ResourcesComponent } from './resources.component';
import { ResourcesService } from './resources.service';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionRenderComponent } from './action.render.component';
import { DeleteResourceModalComponent } from './delete-resource-modal/delete-resource-modal.component';
import { AddResourceModalComponent } from './add-resource-modal/add-resource-modal.component';
import { EditResourceModalComponent } from './edit-resource-modal/edit-resource-modal.component';
import { SaveResourceModalComponent } from './save-resource-modal/save-resource-modal.component';
import { ViewResourceModalComponent } from './view-resource-modal/view-resource-modal.component';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';

import { AgmCoreModule } from '@agm/core';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    NgbModalModule,
    routing,
    Ng2SmartTableModule,
    HttpModule,
    Ng2AutoCompleteModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAbFOBw831G3lCOb2GDw54jbO3LJwQLBxQ'
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
  declarations: [
    ResourcesComponent,
    ActionRenderComponent,
    DeleteResourceModalComponent,
    AddResourceModalComponent,
    EditResourceModalComponent,
    SaveResourceModalComponent,
    ViewResourceModalComponent
 ],
   entryComponents: [
    ActionRenderComponent,
    DeleteResourceModalComponent,
    AddResourceModalComponent,
    EditResourceModalComponent,
    SaveResourceModalComponent,
    ViewResourceModalComponent
  ],

  bootstrap: [ AddResourceModalComponent ],
  providers: [
    ResourcesService,
  ]
})
export class ResourcesModule {
}