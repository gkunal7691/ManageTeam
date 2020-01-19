import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';
import { DayModalContentComponent } from '../../+standard-shared/components/day-modal-content/day-modal-content.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dueDate: Date;
  userList: any;
  task: any;
 
  @ViewChild(DayModalContentComponent, { static: true }) dayDetail: DayModalContentComponent;

  constructor(private loginService: LoginService, private userService: UserService) { }



  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getTask(task) {
    this.task = task;
    this.getPreviousDate();
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

  goToPresentDay(){
    this.dueDate = new Date();
    this.dayDetail.dateChange();
  }

}
