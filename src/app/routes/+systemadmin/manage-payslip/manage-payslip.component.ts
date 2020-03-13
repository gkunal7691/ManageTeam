import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-manage-payslip',
  templateUrl: './manage-payslip.component.html',
  styleUrls: ['./manage-payslip.component.scss']
})

export class ManagePayslipComponent implements OnInit {
  userId: number;
  hideBtn: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.userId = this.route.snapshot.params.id
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigateByUrl('/systemadmin/admin');
  }
}