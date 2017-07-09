import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard } from './authguard';

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
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard]},
      { path: 'smartTables', loadChildren: './smartTables/smartTables.module#SmartTablesModule', canActivate: [AuthGuard]},
      { path: 'images', loadChildren: './image-crud/image-crud.module#ImageCrudModule', canActivate: [AuthGuard]},
      { path: 'resources', loadChildren: './resources/resources.module#ResourcesModule', canActivate: [AuthGuard]},
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
