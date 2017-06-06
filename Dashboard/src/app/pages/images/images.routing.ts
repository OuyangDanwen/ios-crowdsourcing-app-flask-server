import { Routes, RouterModule }  from '@angular/router';

import { Images } from './images.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Images
  }
];

export const routing = RouterModule.forChild(routes);
