import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DailyOverviewBoxComponent } from './components/daily-overview-box/daily-overview-box.component';
import { DailyTaskComponent } from './components/daily-task/daily-task.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomDatePipe } from '../../services/pipes/custom-date.pipe';
import { PositiveValuePipe } from '../../services/pipes/positive-value.pipe';
import { TimeAttendanceComponent } from './components/time-attendance/time-attendance.component';

@NgModule({
  declarations: [
    CustomDatePipe,
    PositiveValuePipe,
    DailyOverviewBoxComponent,
    DailyTaskComponent,
    DayDetailComponent,
    TimeAttendanceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    CustomDatePipe,
    PositiveValuePipe
  ],
  exports: [
    DailyOverviewBoxComponent,
    DailyTaskComponent,
    DayDetailComponent,
    TimeAttendanceComponent,
    CustomDatePipe,
    PositiveValuePipe
  ]
})

export class StandardSharedModule { }
