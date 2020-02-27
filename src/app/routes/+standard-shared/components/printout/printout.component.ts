import { Component, OnInit, Input } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'app-printout',
  templateUrl: './printout.component.html',
  styleUrls: ['./printout.component.scss']
})
export class PrintoutComponent implements OnInit {
  @Input() payslipList: any;
  @Input() userList: any;
  month;
  config: ExportAsConfig = {
    type: 'pdf',
    elementId: 'mytable',
  }
  constructor(private exportAsService: ExportAsService) { }

  ngOnInit() {
    this.fullMonth();
  }

  fullMonth() {
    if (this.payslipList) {
      if (this.payslipList.month == 'Jan') {
        this.month = 'January'
      }
      else if (this.payslipList.month == 'Feb') {
        this.month = 'February'
      }
      else if (this.payslipList.month == 'Mar') {
        this.month = 'March'
      }
      else if (this.payslipList.month == 'Apr') {
        this.month = 'April'
      }
      else if (this.payslipList.month == 'May') {
        this.month = 'May'
      }
      else if (this.payslipList.month == 'Jun') {
        this.month = 'June'
      }
      else if (this.payslipList.month == 'Jul') {
        this.month = 'July'
      }
      else if (this.payslipList.month == 'Aug') {
        this.month = 'August'
      }
      else if (this.payslipList.month == 'Sep') {
        this.month = 'September'
      }
      else if (this.payslipList.month == 'Oct') {
        this.month = 'October'
      }
      else if (this.payslipList.month == 'Nov') {
        this.month = 'Novemember'
      }
      else if (this.payslipList.month == 'Dec') {
        this.month = 'December'
      }
    }
  }

  exportAs() {
    this.exportAsService.save(this.config, 'Payslip').subscribe(() => {
    });
  }

}
