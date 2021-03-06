import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerConfigComponent } from './shared/components/server-config/server-config.component';
import { HelpComponent } from './shared/components/help/help.component';
import { SigninComponent } from './shared/components/signin/signin.component';
import { ErrorComponent } from './shared/components/error/error.component';
import { AuthGuard } from './shared/services/auth.guard';

export const routes: Routes = [
  { path: 'lnd', loadChildren: () => import('./lnd/lnd.module').then(childModule => childModule.LNDModule), canActivate: [AuthGuard] },
  { path: 'cl', loadChildren: () => import('./clightning/cl.module').then(childModule => childModule.CLModule), canActivate: [AuthGuard] },
  { path: 'sconfig', component: ServerConfigComponent, canActivate: [AuthGuard] },
  { path: 'help', component: HelpComponent },
  { path: 'login', component: SigninComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: NotFoundComponent } 
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
