import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgDragDropModule } from 'ng-drag-drop';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeModule } from 'angular-tree-component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminEmployeeComponent } from './admin-employee/admin-employee.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { ToasterService } from 'angular2-toaster';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TimeAttendanceComponent } from './time-attendance/time-attendance.component';
import { DayOverviewComponent } from './day-overview/day-overview.component';
import { CustomDatePipe } from './custom-date.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    LeaveRequestComponent,
    AdminEmployeeComponent,
    TimeAttendanceComponent,
    DayOverviewComponent,
    CustomDatePipe
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NgxSelectModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    TreeModule,
    NgDragDropModule.forRoot(),
  ],
  providers: [
    ChildAuthGuard,
    ToasterService
  ]
})
export class AdminModule { }
