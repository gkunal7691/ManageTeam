import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { NotificationComponent } from './notification/notification.component';
import { HolidayComponent } from './holiday/holiday.component';
import { DayOffComponent } from './day-off/day-off.component';
import { ManagePayslipComponent } from './manage-payslip/manage-payslip.component';

const routes: Routes = [
  { path: 'sadashboard', component: DashboardComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'notification', component: NotificationComponent },
  { path: 'holiday', component: HolidayComponent },
  { path: 'dayoff', component: DayOffComponent },
  { path: 'ManagePayslip/:roleId', component: ManagePayslipComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SystemadminRoutingModule { }