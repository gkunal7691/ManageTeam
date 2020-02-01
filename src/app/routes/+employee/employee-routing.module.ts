import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MonthViewComponent } from '../+standard-shared/components/month-view/month-view.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { TodoComponent } from './todo/todo.component';
import { CompleteTodoTaskComponent } from './complete-todo-task/complete-todo-task.component';
import { BacklogComponent } from '../+standard-shared/components/backlog/backlog.component';
import { TaskContentComponent } from '../+standard-shared/components/task-content/task-content.component';
import { DayViewComponent } from '../+standard-shared/components/day-view/day-view.component';

const routes: Routes = [
  // { path: 'edashboard', canActivate: [ChildAuthGuard], component: DashboardComponent },
  { path: 'edashboard', canActivate: [ChildAuthGuard], component: DayViewComponent },
  { path: 'eprofile', canActivate: [ChildAuthGuard], component: ProfileComponent },
  { path: 'month-view', canActivate: [ChildAuthGuard], component: MonthViewComponent },
  { path: 'manage-leave', canActivate: [ChildAuthGuard], component: ManageLeaveComponent },
  { path: 'task/:id', component: TaskContentComponent },
  { path: 'todo', canActivate: [ChildAuthGuard], component: TodoComponent },
  { path: 'todo/:id', canActivate: [ChildAuthGuard], component: TodoComponent },
  { path: 'backlog', canActivate: [ChildAuthGuard], component: BacklogComponent },
  { path: 'todo/completed/:id', canActivate: [ChildAuthGuard], component: CompleteTodoTaskComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmployeeRoutingModule { }
