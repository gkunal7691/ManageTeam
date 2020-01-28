import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TaskContentComponent } from '../task-content/task-content.component';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})

export class TaskModalComponent implements OnInit {
  @Input() userId: any;
  @Input() userList: any;
  @Input() dueDate: any;
  @Output() updateTaskList = new EventEmitter();
  @Input() task: any;
  @Input() totalEstimatedTime: number;
  @ViewChild(TaskContentComponent, { static: true }) taskContent: TaskContentComponent;

  taskId: number;

  constructor() { }

  ngOnInit() { }

  addNewTask() {
    this.task = null;
    this.updateTask(this.task);
  }

  updateTask(task) {
    console.log(task)
    this.taskContent.updateTask(task);
    if (task) {
      this.task = task;
      this.taskId = task.taskId;
    }
  }

  getTask(task) {
    console.log("gettasl")
    this.task = task;
    this.updateTask(task);
    console.log(this.task)
  }

  getUpdatedTaskList() {
    console.log("task-modal");
    this.updateTaskList.emit()
  }

  updateTaskComment() {
    console.log("Test")
    this.getUpdatedTaskList();
  }


}
