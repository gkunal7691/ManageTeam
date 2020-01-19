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
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { StandardSharedModule } from '../+standard-shared/standard-shared.module';
import { UserService } from '../../services/user.service';
import { ViewLeaveDetailsComponent } from './view-leave-details/view-leave-details.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    LeaveRequestComponent,
    AdminEmployeeComponent,
    ViewLeaveDetailsComponent
  ],
  imports: [
    StandardSharedModule,
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
    UserService
  ]
})

export class AdminModule { }
