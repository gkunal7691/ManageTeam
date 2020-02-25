import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
declare var swal: any;

@Component({
  selector: 'app-manage-payslip',
  templateUrl: './manage-payslip.component.html',
  styleUrls: ['./manage-payslip.component.scss']
})

export class ManagePayslipComponent implements OnInit {
  addPayslipForm: FormGroup;
  userData: any[];

  displayedColumns: string[] = ["year", "month", "basicPay", "hra", "specialAllowance", "hotSkillBonus",
    "providentFund", "professionalTax", "incomeTax"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addPayslipForm = this.fb.group({
      year: ['', [Validators.required]],
      month: ['', [Validators.required]],
      basicPay: ['', [Validators.required]],
      hra: ['', [Validators.required]],
      specialAllowance: ['', [Validators.required]],
      hotSkillBonus: ['', [Validators.required]],
      providentFund: ['', [Validators.required]],
      professionalTax: ['', [Validators.required]],
      incomeTax: ['', [Validators.required]]
    })
    this.userData = [{
      year: 2019, month: "Jan", basicPay: 15000, hra: 100, specialAllowance: 200, hotSkillBonus: 300,
      providentFund: 400, professionalTax: 500, incomeTax: 600
    }];
    console.log(this.userData);
    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  onSelectYear(value) {
    console.log(value);
  }

  onSelectMonth(value) {
    console.log(value);
  }

  onAddPayslip() {
    console.log(this.addPayslipForm.value);
  }

  formReset() {
    let date: any = new Date();
    this.addPayslipForm.get('year').setValue(date.getFullYear());
    date = date.toString();
    this.addPayslipForm.get('month').setValue(date[4] + date[5] + date[6]);
    this.addPayslipForm.get("basicPay").reset();
    this.addPayslipForm.get("hra").reset();
    this.addPayslipForm.get("specialAllowance").reset();
    this.addPayslipForm.get("hotSkillBonus").reset();
    this.addPayslipForm.get("providentFund").reset();
    this.addPayslipForm.get("professionalTax").reset();
    this.addPayslipForm.get("incomeTax").reset();
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

}
