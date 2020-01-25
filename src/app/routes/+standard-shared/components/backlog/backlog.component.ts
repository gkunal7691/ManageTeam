import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../../../services/task.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EmployeeService } from '../../../../services/employee.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  backLogTasks: any;
  userList: any;
  task: any;
  dueDate: Date;

  @Output() updateTaskList = new EventEmitter();

  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;

  constructor(private taskService: TaskService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getUserList();
    this.getBackLogTaskList();
  }

  getBackLogTaskList() {
    this.taskService.getBacklogTasks().subscribe((res: any) => {
      this.backLogTasks = res.data;
    })
  }

  getUserList() {
    this.employeeService.getEmployeeList().subscribe(
      (res: any) => {
        this.userList = res.data;
      })
  }

  editTask(task) {
    this.task = task;
    this.taskModal.updateTask(this.task);
    this.getBackLogTaskList();
  }

  addTask() {
    this.dueDate =new Date(0);
    this.task = null;    
    this.taskModal.updateTask(this.task);
    this.getBackLogTaskList();
  }

  moveTask(task) {
    this.task = task
    this.dueDate = new Date();
  }

  reOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.backLogTasks, event.previousIndex, event.currentIndex);
    this.taskService.reOrderMenu(this.backLogTasks).subscribe((res: any) => {
      this.getBackLogTaskList();
    });
  }

  getUpdatedTaskList() {
    this.getBackLogTaskList();
  }

}
