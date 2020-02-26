import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ManagePayslipService } from '../../../services/manage-payslip.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})

export class PayslipComponent implements OnInit {
  addPayslipForm: FormGroup;
  paySlipList: any;
  currentYear: Date;
  currentMonth: Date;
  selectedPaySlipId: number;
  disableGoButton: boolean;

  displayedColumns: string[] = ["name", "year", "month", "basic", "house_rent_allowance", "special_allowance",
    "hot_skill_bonus", "provident_fund", "professional_tax", "income_tax", "action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private managePayslipService: ManagePayslipService, private fb: FormBuilder) { }

  ngOnInit() {
    this.addPayslipForm = this.fb.group({
      year: ['', [Validators.required]],
      month: ['', [Validators.required]]
    })
    let date: any = new Date();
    this.currentYear = date.getFullYear();
    date = date.toString();
    this.currentMonth = date[4] + date[5] + date[6];
    this.getPaySlip();
  }

  getPaySlip() {
    this.managePayslipService.getEmployeePaySlip({
      year: this.currentYear, month: this.currentMonth
    }).subscribe((res: any) => {
      this.paySlipList = res.data;
      console.log(res.data);
      this.dataSource = new MatTableDataSource(this.paySlipList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onSelectYear(value) {
    console.log(value);
    if (value == '') {
      this.disableGoButton = true;
    }
    else {
      this.disableGoButton = false;
      this.currentYear = value;
    }
  }

  onSelectMonth(value) {
    console.log(value);
    if (value == '') {
      this.disableGoButton = true;
    }
    else {
      this.disableGoButton = false;
      this.currentMonth = value;
    }
  }

  downloadPaySlip(paySlip) {
    console.log(paySlip);
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

}