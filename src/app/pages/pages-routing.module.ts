import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { AuthGuard } from '../guards/auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenances/users/users.component';
import { HospitalsComponent } from './maintenances/hospitals/hospitals.component';
import { MedicsComponent } from './maintenances/medics/medics.component';
import { MedicComponent } from './maintenances/medics/medic.component';
import { SearchesComponent } from './searches/searches.component';
import { AdminGuard } from '../guards/admin.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent, data: { title: 'Dashboard' } },
      {
        path: 'account-settings',
        component: AccountSettingsComponent,
        data: { title: 'Ajustes de tema' },
      },
      {
        path: 'grafica1',
        component: Grafica1Component,
        data: { title: 'Gráficas' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Perfil de usuario' },
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: { title: 'Progreso' },
      },
      {
        path: 'promises',
        component: PromisesComponent,
        data: { title: 'Promesas' },
      },
      { path: 'rxjs', component: RxjsComponent, data: { title: 'RxJs' } },
      {
        path: 'search/:term',
        component: SearchesComponent,
        data: { title: 'Búsqueda' },
      },

      // Mantenimiento
      {
        path: 'hospitals',
        component: HospitalsComponent,
        data: { title: 'Mantenimiento de hospitales' },
      },
      {
        path: 'medics',
        component: MedicsComponent,
        data: { title: 'Mantenimiento de médicos' },
      },
      {
        path: 'medics/:id',
        component: MedicComponent,
        data: { title: 'Médico' },
      },

      // Rutas del admin
      {
        path: 'users',
        canActivate: [AdminGuard],
        component: UsersComponent,
        data: { title: 'Usuario de aplicación' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
