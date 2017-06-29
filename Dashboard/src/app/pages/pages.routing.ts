import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './authguard';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pages',
    component: Pages,
    canActivate: [AuthGuard],
    children: [
      // { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard]},
      // { path: 'labels', loadChildren: './labels/labels.module#LabelsModule' },
      { path: 'smartTables', loadChildren: './smartTables/smartTables.module#SmartTablesModule', canActivate: [AuthGuard]},
      { path: 'images', loadChildren: './image-crud/image-crud.module#ImageCrudModule', canActivate: [AuthGuard]},
      { path: 'resources', loadChildren: './resources/resources.module#ResourcesModule', canActivate: [AuthGuard]},
      // { path: 'editors', loadChildren: './editors/editors.module#EditorsModule' },
      // { path: 'components', loadChildren: './components/components.module#ComponentsModule' },
      // { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
        // { path: 'ui', loadChildren: './ui/ui.module#UiModule' },
      //{ path: 'forms', loadChildren: './forms/forms.module#FormsModule' }
      // { path: 'tables', loadChildren: './tables/tables.module#TablesModule' }
      // { path: 'maps', loadChildren: './maps/maps.module#MapsModule' }
      // { path: 'images', loadChildren: './images/images.module#ImagesModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
