import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DayOverviewComponent } from './components/day-overview/day-overview.component';
import { TaskComponent } from './components/task/task.component';
import { DayDetailComponent } from './components/day-detail/day-detail.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomDatePipe } from '../../services/pipes/custom-date.pipe';
import { PositiveValuePipe } from '../../services/pipes/positive-value.pipe';
import { MonthViewComponent } from './components/month-view/month-view.component';

@NgModule({
  declarations: [
    CustomDatePipe,
    PositiveValuePipe,
    DayOverviewComponent,
    TaskComponent,
    DayDetailComponent,
    MonthViewComponent
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
    DayOverviewComponent,
    TaskComponent,
    DayDetailComponent,
    MonthViewComponent,
    CustomDatePipe,
    PositiveValuePipe
  ]
})

export class StandardSharedModule { }
