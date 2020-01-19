import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnChanges {

  dueDate: Date;
  userList: any;
  task:any;
  constructor(private loginService: LoginService, private userService: UserService) { }
  ngOnChanges(changes: SimpleChanges): void {

  //this.getTask();
  }

  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getTask(task) {
    console.log(task)
    this.task = task;
  }

  getUpdatedTaskList(task) {
    console.log(task)
    console.log("getUpdatedTaskList")
  }

  getEmployees() {
    this.userService.getEmployees().subscribe((res: any) => {
      console.log(res.data);
      this.userList = res.data;
    })
  }

}
