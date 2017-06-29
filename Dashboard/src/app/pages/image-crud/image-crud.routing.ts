import { Routes, RouterModule }  from '@angular/router';

import { ImageCrudComponent } from './image-crud.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ImageCrudComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
