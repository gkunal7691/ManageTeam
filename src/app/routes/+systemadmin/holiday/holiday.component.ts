import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { HolidayService } from '../../../services/holiday.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {

  AddHolidayForm: FormGroup;
  EditHolidayForm: FormGroup;
  holidayList: any[] = [];
  bsValue = new Date();
  holidayId: any;
  bsConfig = {
    containerClass: 'theme-angle'
  }
  windowWidth: any;


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;

  }
  displayedColumns: string[] = ["holidayDate", "holidayType", "occasion", "choose_response"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private fb: FormBuilder, private holidayService: HolidayService) { this.onResize(); }



  ngAfterViewChecked() {
    this.onResize();
  }



  ngOnInit() {

    this.AddHolidayForm = this.fb.group({
      holidayDate: ['', [Validators.required]],
      holidayType: ['', [Validators.required]],
      occasion: [''],
    });

    this.EditHolidayForm = this.fb.group({
      holidayDate: ['', [Validators.required]],
      holidayType: ['', [Validators.required]],
      occasion: [''],
    });

    this.getAllHolidayList();
  }

  formReset() {
    this.AddHolidayForm.reset();
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }


  getAllHolidayList() {

    this.holidayService.getHolidayList().subscribe((res: any) => {
      console.log(res)
      this.holidayList = res.data;
      this.dataSource = new MatTableDataSource(this.holidayList)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

  }

  createHoliday() {
    this.holidayService.createHolidayList({
      holidayDate: this.AddHolidayForm.get('holidayDate').value,
      holidayType: this.AddHolidayForm.get('holidayType').value,
      occasion: this.AddHolidayForm.get('occasion').value
    }).subscribe(
      (res: any) => {
        console.log(res)
        this.getAllHolidayList();
      })
  }


  editHoliday(value) {
    let expectDate = new Date(value.holidayDate);
    let finalDate = (expectDate.getMonth() + 1) + '/' + expectDate.getDate() + '/' + expectDate.getFullYear();
    this.EditHolidayForm.get('holidayDate').setValue(finalDate)
    this.EditHolidayForm.get('holidayType').setValue(value.holidayType)
    this.EditHolidayForm.get('occasion').setValue(value.occasion)
    this.holidayId = value.holidayId;

  }

  saveHoliday() {
    this.holidayService.updateHoliday({ holidayDate: this.EditHolidayForm.get('holidayDate').value, holidayType: this.EditHolidayForm.get('holidayType').value, occasion: this.EditHolidayForm.get('occasion').value, holidayId: this.holidayId }).subscribe((res: any) => {
      this.getAllHolidayList();
    })
  }

  deleteHoliday(value) {
    this.holidayService.deleteHoliday({ holidayId: value.holidayId }).subscribe((res: any) => {
      this.getAllHolidayList();
    })
  }

}

