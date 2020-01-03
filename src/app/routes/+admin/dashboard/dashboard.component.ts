import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user;
  constructor(private loginService: LoginService) { }

  ngOnInit() {

    this.user = this.loginService.currentUser;

  }

}
