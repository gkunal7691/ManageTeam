import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ColorsService } from '../../../../shared/colors/colors.service';

@Component({
  selector: 'app-day-overview',
  templateUrl: './day-overview.component.html',
  styleUrls: ['./day-overview.component.scss']
})

export class DayOverviewComponent implements OnInit, OnChanges {
  firstDay: any;
  lastDay: any;
  clickedDate: any;
  plannedTaskList: [] = [];
  completedTaskList: [] = [];
  inProgressTaskList: [] = [];
  holiday: any;
  leaveStatus: any;
  showLeave: any;
  showCurrentDate: boolean;
  isLeaveDay: boolean;
  stacked: any[] = [];
  newStacked: any[] = [];
  clientTime: number = 0;
  orginalSpentTime: number = 0;
  estimatedTime: number = 0;
  sparkOptionsInfo = {
    type: 'pie',
    sliceColors: [this.colors.byName('success'), this.colors.byName('danger')],
    height: 30
  };

  constructor(private ref: ChangeDetectorRef, public colors: ColorsService) { }

  @Input() currentUserId: any;
  @Input() date: any;
  @Input() holidayList: any;
  @Input() allTasksList: any;
  @Output() openModalDate = new EventEmitter();
  @Input() iscurrentDate: any;
  @Input() leaveData: any;

  ngOnInit() { }

  ngOnChanges(): void {
    this.stacked = [];
    this.newStacked = [];
    this.getHoliday();
    this.filterTaskList();
    this.taskCalculation();
    this.filterisLeave();
    this.ref.detectChanges();
  }

  getHoliday() {
    this.holiday = this.holidayList.find(d => (new Date(d.holidayDate).getDate() + '/' + 
      (new Date(d.holidayDate).getMonth() + 1) + '/' + (new Date(d.holidayDate).getFullYear())) == 
      (new Date(this.date).getDate() + '/' + (new Date(this.date).getMonth() + 1) + '/' + (new Date(this.date).getFullYear())));
  }

  showDay(val) {
    this.clickedDate = val;
    this.openModalDate.emit(this.clickedDate);
  }

  filterTaskList() {
    let d = new Date(this.date)
    if (this.date == this.iscurrentDate) {
      this.showCurrentDate = true;
    }
    this.plannedTaskList = this.allTasksList.filter(task => task.status == "planned" && new Date(task.dueDate).getDate() == d.getDate())
    this.inProgressTaskList = this.allTasksList.filter(task => task.status == "progress" && new Date(task.dueDate).getDate() == d.getDate())
    this.completedTaskList = this.allTasksList.filter(task => task.status == "completed" && new Date(task.dueDate).getDate() == d.getDate())

    this.newStacked.push({
      value: this.completedTaskList.length,
      type: "success"
    }, {
      value: this.inProgressTaskList.length,
      type: "info"
    }, {
      value: (this.plannedTaskList.length + this.inProgressTaskList.length + this.completedTaskList.length),
      type: "danger"
    })
  }

  taskCalculation() {
    this.clientTime = 0;
    this.orginalSpentTime = 0;
    this.estimatedTime = 0;
    this.allTasksList.forEach(task => {
      if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' + 
        (new Date(task.dueDate).getFullYear())) == (new Date(this.date).getDate() + '/' + 
        (new Date(this.date).getMonth() + 1) + '/' + (new Date(this.date).getFullYear()))) {
          
        this.clientTime += task.clientTime;
        this.orginalSpentTime += task.originalTime;
        this.estimatedTime += task.estimatedTime;
      }
    })
    this.stacked.push({
      value: this.orginalSpentTime,
      type: "success"
    }, {
      value: (this.estimatedTime > this.orginalSpentTime) ? (this.estimatedTime - this.orginalSpentTime) : 0,
      type: "info"
    }, {
      value: (this.orginalSpentTime + this.estimatedTime) === 0 ? 0 : 480,
      type: "danger"
    });
  }

  filterisLeave() {
    if (this.leaveData) {
      this.leaveData.forEach(d => {
        let isLeavefromDate = new Date(d.fromDate).setHours(0, 0, 0);
        let isLeavetoDate = new Date(d.toDate).setHours(0, 0, 0);
        if (this.date >= isLeavefromDate && this.date <= isLeavetoDate) {
          this.showLeave = true;
          this.leaveStatus = d.status;
        }
      })
    }
  }


}
