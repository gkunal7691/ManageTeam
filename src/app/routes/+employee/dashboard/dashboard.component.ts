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
  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;
  dueDate: Date;
  userList: any;
  task: any;
  userId: number;
  showLoader;
  @ViewChild(DayModalContentComponent, { static: true }) dayDetail: DayModalContentComponent;

  constructor(private loginService: LoginService, private userService: UserService) {
    this.userId = this.loginService.currentUser.id;
  }

  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getTask(task) {
    this.task = task;
    console.log(this.task)
  }

  getUpdatedTaskList(task) {
    this.dayDetail.getDayTask();
  }

  getEmployees() {
    this.userService.getEmployees().subscribe((res: any) => {
      console.log(res.data);
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
    console.log('ppp')
    this.taskModal.addNewTask();
  }

}
