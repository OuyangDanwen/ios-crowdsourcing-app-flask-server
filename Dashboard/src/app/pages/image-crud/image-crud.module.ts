import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";
import { HotTable, HotTableModule } from 'ng2-handsontable';
import { routing } from './image-crud.routing';
import { ImageCrudComponent } from './image-crud.component';
import { ImageCrudService } from './image-crud.service';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageRenderComponent } from './image.render.component';
import { DeleteButtonRenderComponent } from './del.button.render.component';
import { ViewPhotosModalComponent } from './view-photos-modal/view-photos-modal.component';

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
    ImageCrudComponent,
    // ButtonRenderComponent,
    ImageRenderComponent,
    DeleteButtonRenderComponent,
    ViewPhotosModalComponent,
 ],
   entryComponents: [
    // ButtonRenderComponent,
    ImageRenderComponent,
    DeleteButtonRenderComponent,
    ViewPhotosModalComponent
  ],
  providers: [
    ImageCrudService,
  ]
})
export class ImageCrudModule {
}