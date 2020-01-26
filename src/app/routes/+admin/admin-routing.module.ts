import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BacklogComponent } from '../+standard-shared/components/backlog/backlog.component';
import { MonthViewComponent } from '../+standard-shared/components/month-view/month-view.component';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'adashboard', canActivate: [ChildAuthGuard], component: DashboardComponent },
  { path: 'aprofile', canActivate: [ChildAuthGuard], component: ProfileComponent },
  { path: 'leave-request', canActivate: [ChildAuthGuard], component: LeaveRequestComponent },
  { path: 'admin-employee', canActivate: [ChildAuthGuard], component: AdminEmployeeComponent },
  { path: 'manage-time', canActivate: [ChildAuthGuard], component: MonthViewComponent },
  { path: 'backlog', canActivate: [ChildAuthGuard], component: BacklogComponent },

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