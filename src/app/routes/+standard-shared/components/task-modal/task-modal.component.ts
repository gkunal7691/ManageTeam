import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TaskContentComponent } from '../task-content/task-content.component';
import { TaskService } from '../../../../services/task.service';

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

  constructor(private taskService: TaskService) { }

  ngOnInit() { }

  addNewTask() {
    this.task = null;
    this.updateTask(this.task);
  }

  updateTask(task) {
    this.taskContent.updateTask(task);
    if (task) {
      this.task = task;
      this.taskId = task.taskId;
    }
  }

  getTask(task) {
    this.task = task;
    this.updateTask(task);
  }

  getUpdatedTaskList() {
    this.updateTaskList.emit()
  }

  updateTaskComment() {
    this.taskService.getSingleTask(this.task.taskId).subscribe((res: any) => {
      this.task = res.data;
      this.getUpdatedTaskList();
    })
  }


}
