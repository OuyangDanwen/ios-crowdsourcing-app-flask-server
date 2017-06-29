import { NgModule } from '@angular/core';
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



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    NgbModalModule,
    routing,
    Ng2SmartTableModule,
    HttpModule,
  ],
  declarations: [
    ResourcesComponent,
    ActionRenderComponent,
    DeleteResourceModalComponent,
    AddResourceModalComponent,
    EditResourceModalComponent,
    SaveResourceModalComponent,
 ],
   entryComponents: [
    ActionRenderComponent,
    DeleteResourceModalComponent,
    AddResourceModalComponent,
    EditResourceModalComponent,
    SaveResourceModalComponent,
  ],
  providers: [
    ResourcesService,
  ]
})
export class ResourcesModule {
}