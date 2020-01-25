import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DayOverviewComponent } from './components/day-overview/day-overview.component';
import { TaskModalComponent } from './components/task-modal/task-modal.component';
import { DayDetailComponent } from './components/day-detail-modal/day-detail-modal.component';
import { SharedModule } from '../../shared/shared.module';
import { CustomDatePipe } from '../../services/pipes/custom-date.pipe';
import { PositiveValuePipe } from '../../services/pipes/positive-value.pipe';
import { MonthViewComponent } from './components/month-view/month-view.component';
import { DayModalContentComponent } from './components/day-modal-content/day-modal-content.component';
import { MoveToCompletedModalComponent } from './components/move-to-completed-modal/move-to-completed-modal.component';
import { MoveToNextDateModalComponent } from './components/move-to-next-date-modal/move-to-next-date-modal.component';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';
import { BacklogComponent } from './components/backlog/backlog.component';

@NgModule({
  declarations: [
    CustomDatePipe,
    PositiveValuePipe,
    DayOverviewComponent,
    TaskModalComponent,
    DayDetailComponent,
    MonthViewComponent,
    DayModalContentComponent,
    MoveToCompletedModalComponent,
    MoveToNextDateModalComponent,
    CommentModalComponent,
    BacklogComponent
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
    CustomDatePipe,
    PositiveValuePipe,
    DayOverviewComponent,
    TaskModalComponent,
    DayDetailComponent,
    MonthViewComponent,
    DayModalContentComponent,
    MoveToCompletedModalComponent,
    MoveToNextDateModalComponent,
    CommentModalComponent,
  ]
})

export class StandardSharedModule { }
