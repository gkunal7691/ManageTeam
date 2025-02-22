import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeRoutingModule } from './employee-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { ProfileComponent } from './profile/profile.component';
import { NgDragDropModule } from 'ng-drag-drop';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';
import { TodoComponent } from './todo/todo.component';
import { CompleteTodoTaskComponent } from './complete-todo-task/complete-todo-task.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { StandardSharedModule } from '../+standard-shared/standard-shared.module';
import { UserService } from '../../services/user.service';
import { PayslipComponent } from './payslip/payslip.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ManageLeaveComponent,
    TodoComponent,
    CompleteTodoTaskComponent,
    PayslipComponent
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
    StandardSharedModule
  ],
  providers: [
    ChildAuthGuard,
    UserService
  ]
})

export class EmployeeModule { }
