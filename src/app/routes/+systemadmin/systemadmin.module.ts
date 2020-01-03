import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { ChildAuthGuard } from '../../services/guards/child-auth-guard.service';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { NotificationComponent } from './notification/notification.component';
import { SystemadminRoutingModule } from './systemadmin-routing.module';
import { HolidayComponent } from './holiday/holiday.component';
import { NgxSelectModule } from 'ngx-select-ex';
import { DayOffComponent } from './day-off/day-off.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    SystemadminRoutingModule,
    Ng2TableModule,
    ReactiveFormsModule,
    NgxSelectModule,
    FormsModule,
    SharedModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule
  ],
  declarations: [DashboardComponent, AdminComponent, NotificationComponent, HolidayComponent, DayOffComponent],

  providers:[
    ChildAuthGuard
  ]
})
export class SystemadminModule { }
