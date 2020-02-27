import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})

export class PayslipComponent implements OnInit {

  userId: number;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.userId = this.loginService.currentUser.id
    console.log(this.loginService.currentUser.id)
  }

}