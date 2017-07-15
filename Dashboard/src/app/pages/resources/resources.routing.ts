import { Routes, RouterModule }  from '@angular/router';

import { ResourcesComponent } from './resources.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
