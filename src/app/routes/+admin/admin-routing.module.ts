import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { MonthViewComponent } from '../+standard-shared/components/month-view/month-view.component';

const routes: Routes = [
  { path: 'adashboard',canActivate:[ChildAuthGuard], component: DashboardComponent },
  { path: 'aprofile' ,canActivate:[ChildAuthGuard],  component: ProfileComponent },
  { path: 'leave-request',canActivate:[ChildAuthGuard], component: LeaveRequestComponent },
  { path: 'admin-employee',canActivate:[ChildAuthGuard], component: AdminEmployeeComponent },
  { path: 'manage-time', canActivate: [ChildAuthGuard], component: MonthViewComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminRoutingModule { }