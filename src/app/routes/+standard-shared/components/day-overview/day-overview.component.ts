import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, AfterViewInit } from '@angular/core';
import { ColorsService } from '../../../../shared/colors/colors.service';

@Component({
  selector: 'app-day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.scss']
})

export class DayOverviewComponent implements OnInit, OnChanges {

  dayOverview: any;
  showCurrentDate: boolean;
  stacked: any[] = [];
  newStacked: any[] = [];
  sparkOptionsInfo = {
    type: 'pie',
    sliceColors: [this.colors.byName('success'), this.colors.byName('danger')],
    height: 30
  };

  constructor(private ref: ChangeDetectorRef, public colors: ColorsService) { }

  @Input() userId: any;
  @Input() date: any;
  @Input() monthTasks: any;
  @Output() openModalDate = new EventEmitter();

  ngOnInit() { }

  ngOnChanges(): void {
    this.filterTaskList();
    this.ref.detectChanges();
  }

  showDay(date) {
    this.openModalDate.emit(date);
  }

  filterTaskList() {
    this.stacked = [];
    this.newStacked = [];
    if (new Date(this.date).getTime() == new Date().setHours(0, 0, 0, 0)) {
      this.showCurrentDate = true;
    }
    if (this.monthTasks) {
      this.dayOverview = this.monthTasks.find(task => new Date(task.taskDate).getDate() == new Date(this.date).getDate());
    }
    if (this.dayOverview) {
      this.newStacked.push({
        value: this.dayOverview.totalCompletedTasks,
        type: "success"
      }, {
        value: this.dayOverview.totalInProgressTasks,
        type: "info"
      }, {
        value: (this.dayOverview.totalPlannedTasks + this.dayOverview.totalInProgressTasks + this.dayOverview.totalCompletedTasks),
        type: "danger"
      });
      this.stacked.push({
        value: this.dayOverview.totalOrginalTime,
        type: "success"
      }, {
        value: (this.dayOverview.totalEstimatedTime > this.dayOverview.totalOrginalTime) ? (this.dayOverview.totalEstimatedTime - this.dayOverview.totalOrginalTime) : 0,
        type: "info"
      }, {
        value: (this.dayOverview.totalOrginalTime + this.dayOverview.totalEstimatedTime) === 0 ? 0 : 480,
        type: "danger"
      });
    }
  }


}
