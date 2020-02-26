import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManagePayslipService } from '../../../services/manage-payslip.service';
import { ActivatedRoute } from '@angular/router';
declare var swal: any;

@Component({
  selector: 'app-manage-payslip',
  templateUrl: './manage-payslip.component.html',
  styleUrls: ['./manage-payslip.component.scss']
})

export class ManagePayslipComponent implements OnInit {
  addPayslipForm: FormGroup;
  paySlipList: any;
  currentYear: Date;
  currentMonth: Date;
  title: string;
  selectedPaySlipId: number;
  disableGoButton: boolean;

  displayedColumns: string[] = ["name", "year", "month", "basic", "house_rent_allowance", "special_allowance",
    "hot_skill_bonus", "provident_fund", "professional_tax", "income_tax", "action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private fb: FormBuilder, private managePayslipService: ManagePayslipService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.addPayslipForm = this.fb.group({
      year: ['', [Validators.required]],
      month: ['', [Validators.required]],
      basic: ['', [Validators.required]],
      house_rent_allowance: [''],
      special_allowance: [''],
      hot_skill_bonus: [''],
      provident_fund: [''],
      professional_tax: [''],
      income_tax: [''],
      lopDays: ['', [Validators.required]],
      stdDays: ['', [Validators.required]],
      workedDays: ['', [Validators.required]]
    })
    let date: any = new Date();
    this.currentYear = date.getFullYear();
    date = date.toString();
    this.currentMonth = date[4] + date[5] + date[6];
    this.getPaySlipList();
    this.formReset();
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

  getPaySlipList() {
    console.log(this.currentYear);
    console.log(this.currentMonth);
    console.log(this.route.snapshot.params.id);
    this.managePayslipService.getPaySlipList({
      year: this.currentYear, month: this.currentMonth, userId: this.route.snapshot.params.id
    }).subscribe(
      (res: any) => {
        this.paySlipList = res.data;
        console.log(this.paySlipList);
        this.dataSource = new MatTableDataSource(this.paySlipList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  onAddPayslip() {
    this.managePayslipService.addPaySlip({
      year: this.currentYear.toString(), month: this.currentMonth,
      basic: this.addPayslipForm.get('basic').value,
      house_rent_allowance: this.addPayslipForm.get('house_rent_allowance').value,
      special_allowance: this.addPayslipForm.get('special_allowance').value,
      hot_skill_bonus: this.addPayslipForm.get('hot_skill_bonus').value,
      provident_fund: this.addPayslipForm.get('provident_fund').value,
      professional_tax: this.addPayslipForm.get('professional_tax').value,
      income_tax: this.addPayslipForm.get('income_tax').value,
      lop_days: this.addPayslipForm.get('lopDays').value, std_days: this.addPayslipForm.get('stdDays').value,
      worked_days: this.addPayslipForm.get('workedDays').value, userId: this.route.snapshot.params.id
    }).subscribe(
      (res: any) => {
        swal('Success', 'Payslip added successfully :)', 'success');
        this.getPaySlipList();
      })
  }

  updatePaySlipForEdit(paySlip) {
    console.log(paySlip);
    this.title = "Edit";
    this.selectedPaySlipId = paySlip.payslip_Id;
    this.addPayslipForm.get('year').setValue(paySlip.year);
    this.addPayslipForm.get('month').setValue(paySlip.month);
    this.addPayslipForm.get('basic').setValue(paySlip.basic);
    this.addPayslipForm.get('house_rent_allowance').setValue(paySlip.house_rent_allowance);
    this.addPayslipForm.get('special_allowance').setValue(paySlip.special_allowance);
    this.addPayslipForm.get('hot_skill_bonus').setValue(paySlip.hot_skill_bonus);
    this.addPayslipForm.get('provident_fund').setValue(paySlip.provident_fund);
    this.addPayslipForm.get('professional_tax').setValue(paySlip.professional_tax);
    this.addPayslipForm.get('income_tax').setValue(paySlip.income_tax);
    this.addPayslipForm.get('lopDays').setValue(paySlip.lop_days);
    this.addPayslipForm.get('stdDays').setValue(paySlip.std_days);
    this.addPayslipForm.get('workedDays').setValue(paySlip.worked_days);
  }

  editPayslip() {
    this.managePayslipService.updatePaySlip({
      payslipId: this.selectedPaySlipId,
      year: this.currentYear.toString(), month: this.currentMonth,
      basic: this.addPayslipForm.get('basic').value,
      house_rent_allowance: this.addPayslipForm.get('house_rent_allowance').value,
      special_allowance: this.addPayslipForm.get('special_allowance').value,
      hot_skill_bonus: this.addPayslipForm.get('hot_skill_bonus').value,
      provident_fund: this.addPayslipForm.get('provident_fund').value,
      professional_tax: this.addPayslipForm.get('professional_tax').value,
      income_tax: this.addPayslipForm.get('income_tax').value,
      lop_days: this.addPayslipForm.get('lopDays').value, std_days: this.addPayslipForm.get('stdDays').value,
      worked_days: this.addPayslipForm.get('workedDays').value, userId: this.route.snapshot.params.id
    }).subscribe((res: any) => {
      swal('Success', 'Selected Payslip edited successfully :)', 'success');
      this.getPaySlipList();
      this.formReset();
    })
  }

  deletePaySlipSwal(payslipId) {
    console.log(payslipId);
    swal({
      title: "Are you sure ?",
      text: "Payslip will be deleted from database !",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isConfirm) => {
      if (isConfirm) {
        this.onDeletePayslipPopup(payslipId);
      } else {
        swal('Cancelled', 'Payslip is not deleted :)', 'error');
      }
    });
  }

  onDeletePayslipPopup(payslipId) {
    this.managePayslipService.deletePaySlip(payslipId).subscribe(
      (res: any) => {
        swal('Deleted', 'Payslip has been deleted :)', 'success');
        this.getPaySlipList();
      })
  }

  formReset() {
    this.title = "Add New";
    let date: any = new Date();
    this.addPayslipForm.get('year').setValue(date.getFullYear());
    date = date.toString();
    this.addPayslipForm.get('month').setValue(date[4] + date[5] + date[6]);
    this.addPayslipForm.get("basic").reset();
    this.addPayslipForm.get("house_rent_allowance").reset();
    this.addPayslipForm.get("special_allowance").reset();
    this.addPayslipForm.get("hot_skill_bonus").reset();
    this.addPayslipForm.get("provident_fund").reset();
    this.addPayslipForm.get("professional_tax").reset();
    this.addPayslipForm.get("income_tax").reset();
    this.addPayslipForm.get("lopDays").reset();
    this.addPayslipForm.get("stdDays").reset();
    this.addPayslipForm.get("workedDays").reset();
  }

  downloadPaySlip(paySlip) {
    console.log(paySlip);
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

}