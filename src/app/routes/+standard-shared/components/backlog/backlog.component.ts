import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { EmployeeService } from '../../../../services/employee.service';
import { TaskService } from '../../../../services/task.service';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var swal: any;

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss']
})
export class BacklogComponent implements OnInit {

  allBackLogTasks: any;
  previousTasks: any;
  upcomingTasks: any;
  searchedTasks: any
  filteredBacklogTask: any;
  filterPreviousTask: any;
  filterUpcomingTask: any;
  filterSearchedTask: any;
  showSearchedTask: boolean;
  searchFrom: FormGroup
  userList: any;
  task: any;
  dueDate: Date;
  userIds = [];
  selectAllUser: boolean = true;

  @Output() updateTaskList = new EventEmitter();

  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;

  constructor(private taskService: TaskService, private employeeService: EmployeeService, private fb: FormBuilder) { }

  ngOnInit() {
    this.searchFrom = this.fb.group({
      searchText: ['', Validators.required]
    })
    this.getBackLogTaskList();
  }

  getBackLogTaskList() {
    this.taskService.getBacklogTasks({ firstDay: '0000-00-00', lastDay: '1970-01-01' }).subscribe((res: any) => {
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

  getPreviousTaskList() {
    let currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    let previousDate = new Date();
    previousDate.setDate(previousDate.getDate() - 7);
    let finalDate = previousDate.getFullYear() + '-' + (previousDate.getMonth() + 1) + '-' + previousDate.getDate();
    this.taskService.getBacklogTasks({ firstDay: finalDate, lastDay: currentDate }).subscribe((res: any) => {
      this.previousTasks = res.data.filter(task => task.priority == "critical").concat(res.data.filter(task => task.priority == "high"),
        res.data.filter(task => task.priority == "normal"), res.data.filter(task => task.priority == "low"));
      this.filterPreviousTask = this.previousTasks.filter(task => {
        if (this.userIds.length == 0) {
          return true
        } else {
          return this.userIds.includes(task.userId)
        }
      });
    })
  }

  getUpcomingTaskList() {
    let currentDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    this.taskService.getUpcomingTasks({ dueDate: currentDate }).subscribe((res: any) => {
      this.upcomingTasks = res.data.filter(task => task.priority == "critical").concat(res.data.filter(task => task.priority == "high"),
        res.data.filter(task => task.priority == "normal"), res.data.filter(task => task.priority == "low"));
      this.filterUpcomingTask = this.upcomingTasks.filter(task => {
        if (this.userIds.length == 0) {
          return true
        } else {
          return this.userIds.includes(task.userId)
        }
      });
    })
  }

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
    this.getPreviousTaskList();
    this.getUpcomingTaskList();
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
    this.getUpcomingTaskList();
  }

  searchTask() {
    this.showSearchedTask = true;
    this.taskService.searchTasks(this.searchFrom.get('searchText').value).subscribe((res: any) => {
      this.searchedTasks = res.data.filter(task => task.priority == "critical").concat(res.data.filter(task => task.priority == "high"),
        res.data.filter(task => task.priority == "normal"), res.data.filter(task => task.priority == "low"));
      this.filterSearchedTask = this.searchedTasks.filter(task => {
        if (this.userIds.length == 0) {
          return true
        } else {
          return this.userIds.includes(task.userId)
        }
      });
    })
  }

}
