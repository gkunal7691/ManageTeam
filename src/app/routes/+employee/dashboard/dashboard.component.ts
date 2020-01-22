import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';
import { DayModalContentComponent } from '../../+standard-shared/components/day-modal-content/day-modal-content.component';
import { TaskModalComponent } from '../../+standard-shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dueDate: Date;
  userList: any;
  task: any;
  userId: number;
  showLoader: any;
  totalEstimatedTime: number;

  @ViewChild(DayModalContentComponent, { static: true }) dayDetail: DayModalContentComponent;
  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;


  constructor(private loginService: LoginService, private userService: UserService) {
    this.userId = this.loginService.currentUser.id;
  }

  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getTask(task) {
    this.task = task;
    this.taskModal.updateTask(task);
  }

  getUpdatedTaskList() {
    this.dayDetail.getDayTask();
  }

  getTotalEstimatedTime(val) {
    this.totalEstimatedTime = val;
  }

  getEmployees() {
    this.userService.getEmployees().subscribe((res: any) => {
      this.userList = res.data;
    })
  }

  getPreviousDate() {
    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() - 1));
    this.dayDetail.dateChange();
  }

  getNextDate() {
    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + 1));
    this.dayDetail.dateChange();
  }

  goToPresentDay() {
    this.dueDate = new Date();
    this.dayDetail.dateChange();
  }
  addNewTask() {
    this.taskModal.addNewTask();
  }

}
