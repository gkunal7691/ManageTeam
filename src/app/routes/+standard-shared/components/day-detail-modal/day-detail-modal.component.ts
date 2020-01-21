import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DayModalContentComponent } from '../day-modal-content/day-modal-content.component';

@Component({
  selector: 'app-day-detail-modal',
  templateUrl: './day-detail-modal.component.html',
  styleUrls: ['./day-detail-modal.component.scss']
})

export class DayDetailComponent implements OnInit {
  @Input() userId: any;
  @Input() userList: any;
  @Input() dueDate: any;
  @Output() updateTaskList = new EventEmitter();
  @ViewChild(DayModalContentComponent, { static: true }) dayDetail: DayModalContentComponent;

  taskDeatils: any;
  totalEstimatedTime: number;
  task: any;

  constructor() { }

  ngOnInit() { }

  getTask(task) {
    this.task = task;
  }

  getSelectedTaskDeatils(task) {
    this.taskDeatils = task;
  }

  getTotalEstimatedTime(val) {
    this.totalEstimatedTime = val;
  }

  getUpdatedTaskList(task) {
    this.dayDetail.getDayTask();
    this.updateTaskList.emit();
  }

}