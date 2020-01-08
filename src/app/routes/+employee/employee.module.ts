import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { Dashboardv3Component } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { TimeAttendanceComponent } from './time-attendance/time-attendance.component';
import { DailyOverviewBoxComponent } from './daily-overview-box/daily-overview-box.component';
import { TodoComponent } from './todo/todo.component';
import { CompleteTodoTaskComponent } from './complete-todo-task/complete-todo-task.component';
import { DayDetailComponent } from './day-detail/day-detail.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { DailyTaskComponent } from './daily-task/daily-task.component';
import { CustomDatePipe } from './custom-date.pipe';
import { ChartsModule as Ng2ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    Dashboardv3Component,
    ProfileComponent,
    TimeAttendanceComponent,
    ManageLeaveComponent,
    DailyOverviewBoxComponent,
    TodoComponent,
    CompleteTodoTaskComponent,
    DayDetailComponent,
    DailyTaskComponent,
    CustomDatePipe,    
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgDragDropModule.forRoot(),
    Ng2ChartsModule
  ],
  providers: [
    ChildAuthGuard,
    DatePipe
  ]
})

export class EmployeeModule { }
