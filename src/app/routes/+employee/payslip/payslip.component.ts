import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss']
})
export class PayslipComponent implements OnInit {

  displayedColumns: string[] = ["basicPay", "houseRentAllowance", "specialAllowance", "hotSkillBonus", "providentFund", "professionalTax", "incomeTax", "month", "year", "action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  userData = [{
    year: 2019, month: "Jan", basicPay: 15000, houseRentAllowance: 100, specialAllowance: 200, hotSkillBonus: 300,
    providentFund: 400, professionalTax: 500, incomeTax: 600
  }];

  constructor() { }

  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.userData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }


}
