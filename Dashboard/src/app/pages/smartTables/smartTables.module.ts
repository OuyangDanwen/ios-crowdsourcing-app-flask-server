import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';
import { routing } from './smartTables.routing';
import { SmartTables } from './smartTables.component';
import { SmartTablesService } from './smartTables.service';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddLabelModalComponent } from './add-label-modal/add-label-modal.component';
import { ButtonRenderComponent } from './button.render.component';
import { EditLabelModalComponent } from './edit-label-modal/edit-label-modal.component';
import { DeleteLabelModalComponent } from './delete-label-modal/delete-label-modal.component';
import { AddPhotosModalComponent } from './add-photos-modal/add-photos-modal.component';
import { SaveLabelModalComponent } from './save-label-modal/save-label-modal.component';


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
    SmartTables,
    AddLabelModalComponent,
    ButtonRenderComponent,
    EditLabelModalComponent,
    DeleteLabelModalComponent,
    AddPhotosModalComponent,
    SaveLabelModalComponent
 ],
   entryComponents: [
    AddLabelModalComponent,
    ButtonRenderComponent,
    EditLabelModalComponent,
    DeleteLabelModalComponent,
    AddPhotosModalComponent,
    SaveLabelModalComponent
  ],
  providers: [
    SmartTablesService,
  ]
})
export class SmartTablesModule {
}