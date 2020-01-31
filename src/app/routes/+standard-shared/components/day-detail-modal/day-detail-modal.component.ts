import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DayModalContentComponent } from '../day-modal-content/day-modal-content.component';
import { TaskModalComponent } from '../task-modal/task-modal.component';

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
  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;

  totalEstimatedTime: number;
  task: any;

  constructor() { }

  ngOnInit() { }

  getTask(task) {
    this.task = task;
    this.taskModal.updateTask(task);
  }

  getTotalEstimatedTime(val) {
    this.totalEstimatedTime = val;
  }

  getUpdatedTaskList() {
    this.dayDetail.getDayTask();
    // this.updateTaskList.emit();
  }

  addNewTask() {
    this.taskModal.addNewTask();
  }

}