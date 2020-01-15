import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { Dashboardv3Component } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { TimeAttendanceComponent } from '../+standard-shared/components/time-attendance/time-attendance.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { TodoComponent } from './todo/todo.component';
import { CompleteTodoTaskComponent } from './complete-todo-task/complete-todo-task.component';

const routes: Routes = [
  { path: 'edashboard',canActivate:[ChildAuthGuard], component: Dashboardv3Component },
  { path: 'eprofile',canActivate:[ChildAuthGuard],  component: ProfileComponent },
  { path: 'time-attendance',canActivate:[ChildAuthGuard], component: TimeAttendanceComponent },
  { path: 'manage-leave',canActivate:[ChildAuthGuard], component: ManageLeaveComponent },
  { path: 'todo',canActivate:[ChildAuthGuard],component:TodoComponent},
  { path: 'todo/:id',canActivate:[ChildAuthGuard],component:TodoComponent},
  { path: 'todo/completed/:id',canActivate:[ChildAuthGuard],component:CompleteTodoTaskComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
