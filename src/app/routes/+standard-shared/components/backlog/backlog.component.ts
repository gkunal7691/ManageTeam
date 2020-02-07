import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../../services/employee.service';
import { TaskService } from '../../../../services/task.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';
declare var swal: any;

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  allBackLogTasks: any;
  filteredBacklogTask: any;
  userList: any;
  task: any;
  dueDate: Date;
  userIds = [];
  selectAllUser: boolean = true;

  @Output() updateTaskList = new EventEmitter();

  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;

  constructor(private taskService: TaskService, private employeeService: EmployeeService) { }

  ngOnInit() {
    // this.getPreviousTaskList();
    this.getBackLogTaskList();
  }

  getBackLogTaskList() {
    this.taskService.getBacklogTasks().subscribe((res: any) => {
      this.getUserList();
      this.allBackLogTasks = res.data.filter(task => task.priority == "critical").concat(res.data.filter(task => task.priority == "high"),
        res.data.filter(task => task.priority == "normal"), res.data.filter(task => task.priority == "low"));
      this.filteredBacklogTask = this.allBackLogTasks.filter(task => {
        if (this.userIds.length == 0) {
          return true
        } else {
          return this.userIds.includes(task.userId)
        }
      });
    })
  }

  // getPreviousTaskList() {
  //   let currentDate = new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear();
  //   let previousDate = new Date(); // get today date
  //   previousDate.setDate(previousDate.getDate() - 7);
  //   let finalDate = previousDate.getFullYear() + '-' + ((previousDate.getMonth() + 1) < 10 ? '0' : '') + (previousDate.getMonth() + 1) + '-' + previousDate.getDate();
  //   console.log(currentDate, finalDate)
  //   // this.taskService.getTaskList('').subscribe((res: any) => {
  //   //   console.log(res)
  //   // })
  // }

  getUserList() {
    this.employeeService.getEmployeeList().subscribe(
      (res: any) => {
        this.userList = res.data;
      })
  }

  filterUser(value, userId) {
    if (value) {
      this.userIds.push(userId);
    }
    else {
      this.userIds.splice(this.userIds.indexOf(userId), 1);
    }
    this.getBackLogTaskList();
  }

  editTask(task) {
    this.task = task;
    this.dueDate = this.task.dueDate
    this.taskModal.updateTask(this.task);
  }

  addTask() {
    this.dueDate = new Date(0);
    this.task = null;
    this.taskModal.updateTask(this.task);
  }

  moveTask(task) {
    this.task = task;
    this.getUserList();
    this.dueDate = new Date();
  }

  reOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.filteredBacklogTask, event.previousIndex, event.currentIndex);
    this.taskService.reOrderMenu(this.filteredBacklogTask).subscribe((res: any) => {
      swal('Success', 'Backlog Task has been Reordered successfully', 'success');
      this.getBackLogTaskList();
    });
  }

  getUpdatedTaskList() {
    this.getBackLogTaskList();
  }

}
