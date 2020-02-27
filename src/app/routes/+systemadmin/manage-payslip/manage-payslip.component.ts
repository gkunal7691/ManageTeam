import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-manage-payslip',
  templateUrl: './manage-payslip.component.html',
  styleUrls: ['./manage-payslip.component.scss']
})

export class ManagePayslipComponent implements OnInit {

  userId: number;

  constructor(private route: ActivatedRoute, ) {
    this.userId = this.route.snapshot.params.id
  }

  ngOnInit() {
  }

}