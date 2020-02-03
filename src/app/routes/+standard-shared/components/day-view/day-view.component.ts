import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { LoginService } from '../../../../services/login.service';
import { DayModalContentComponent } from '../../../+standard-shared/components/day-modal-content/day-modal-content.component';
import { TaskModalComponent } from '../../../+standard-shared/components/task-modal/task-modal.component';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss']
})
export class DayViewComponent implements OnInit {

  dueDate: Date;
  userList: any;
  task: any;
  userId: number;
  showLoader: any;
  totalEstimatedTime: number;

  @ViewChild(DayModalContentComponent, { static: true }) dayModalContent: DayModalContentComponent;
  @ViewChild(TaskModalComponent, { static: true }) taskModal: TaskModalComponent;


  constructor(public loginService: LoginService, private userService: UserService) { 
    this.userId = this.loginService.currentUser.id
  }

  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getTask(task) {
    this.task = task;
    this.taskModal.updateTask(task);
  }

  selectedUserTask(value) {
    console.log(value)
    this.userId = value;
    this.getUpdatedTaskList();
  }

  getUpdatedTaskList() {
    this.dayModalContent.getDayTask();
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
    this.dayModalContent.dateChange();
  }

  getNextDate() {
    this.dueDate = new Date(this.dueDate.setDate(this.dueDate.getDate() + 1));
    this.dayModalContent.dateChange();
  }

  goToPresentDay() {
    this.dueDate = new Date();
    this.dayModalContent.dateChange();
  }

  getSelectedDate(selectedDate) {
    this.dueDate = selectedDate;
    this.dayModalContent.dateChange()
  }

  addNewTask() {
    this.taskModal.addNewTask();
  }



}
