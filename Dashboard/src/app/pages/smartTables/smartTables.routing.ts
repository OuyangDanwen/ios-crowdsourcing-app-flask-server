import { Routes, RouterModule }  from '@angular/router';

import { SmartTables } from './smartTables.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: SmartTables
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
