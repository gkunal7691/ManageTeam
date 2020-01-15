import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DailyOverviewBoxComponent } from './components/daily-overview-box/daily-overview-box.component';
import { DailyTaskComponent } from './components/daily-task/daily-task.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomDatePipe } from '../../services/pipes/custom-date.pipe';
import { PositiveValuePipe } from '../../services/pipes/positive-value.pipe';

@NgModule({
  declarations: [
    CustomDatePipe,
    PositiveValuePipe,
    DailyOverviewBoxComponent,
    DailyTaskComponent,
    DayDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers: [
    DatePipe
  ],
  exports: [
    DailyOverviewBoxComponent,
    DailyTaskComponent,
    DayDetailComponent
  ]
})

export class StandardSharedModule { }
