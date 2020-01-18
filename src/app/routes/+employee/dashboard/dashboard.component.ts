import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  dueDate: Date;
  userList: any;

  constructor(private loginService: LoginService, private userService: UserService) { }

  ngOnInit() {
    this.dueDate = new Date();
    this.getEmployees();
  }

  getUpdatedTaskList() {
    console.log("getUpdatedTaskList")
  }

  getEmployees() {
    this.userService.getEmployees().subscribe((res: any) => {
      console.log(res.data);
      this.userList = res.data;
    })
  }

}
