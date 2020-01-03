import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ManageLeaveService } from '../../../services/manage-leave.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from '../../../services/holiday.service';
import { DayoffService } from '../../../services/dayoff.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.scss']
})
export class ManageLeaveComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    document.getElementsByClassName('panel-collapse')[0].setAttribute('style', 'width:134%;background:white;position:relative;right:34.5%;top:10px;border-radius: 5px');
  }

  leaveRequestForm: FormGroup;
  public leaveData: any;

  showTable: boolean;
  isAccOpen2;
  showFilter: boolean = true;

  //date calculation 

  bsRangeValue: Date[];
  maxDate = new Date();
  toDate: any;
  fromDate: any;
  bsConfig = {
    containerClass: 'theme-angle'
  }

  pendingLeave: boolean;
  approvedLeave: boolean;
  rejectedLeave: boolean;
  cancelledLeave: boolean;
  addedLeave: boolean;
  allLeave: boolean;
  totaldaysOff: any;
  invalidDate: boolean;
  holidayList: any;
  dayOffList: any;
  isvalid: boolean;
  isHalfDay: boolean = false;
  selectedStartDate: any;
  selectedEndDate: any;

  displayedColumns: string[] = ["fromDate", "toDate", "noOfdays", "type", "reason", "status", "createdAt", "choose_response"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private manageLeaveService: ManageLeaveService, private fb: FormBuilder,
    private holidayService: HolidayService, private dayoffService: DayoffService) {

  }

  leaveRequestList: any[] = [];

  ngOnInit() {
    this.leaveRequestForm = this.fb.group({
      dates:[],
      totalDays: [{ value: '', disabled: true }],
      type: ['', [Validators.required]],
      reason: ['', [Validators.required]]
    })
    this.pendingLeave = true;
    this.approvedLeave = false;
    this.rejectedLeave = false;
    this.addedLeave = false;
    this.allLeave = false;
    this.cancelledLeave = false;

    this.filterRequestLeave();
    this.leaveCalculation();
    this.getDayoff();
    this.getAllHolidayList();
  }

  formReset() {
    this.leaveRequestForm.reset();
    this.leaveRequestForm.get('type').setValue('')
    this.selectedEndDate = null;
    this.selectedStartDate = null;
    this.isvalid = false;
  }

  pending(value) {
    this.pendingLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  approve(value) {
    this.approvedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  reject(value) {
    this.rejectedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  add(value) {
    this.addedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  cancel(value) {
    this.cancelledLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  all(value) {
    this.allLeave = value
    this.approvedLeave = value
    this.cancelledLeave = value
    this.addedLeave = value
    this.rejectedLeave = value
    this.pendingLeave = value
    this.filterRequestLeave()
  }

  filterRequestLeave() {
    let status = {}
    status['ispending'] = this.pendingLeave;
    status['isapprove'] = this.approvedLeave;
    status['isreject'] = this.rejectedLeave;
    status['isadd'] = this.addedLeave;
    status['iscancel'] = this.cancelledLeave;
    console.log(status)

    this.manageLeaveService.getManageLeaveList(status).subscribe(
      (result: any) => {
        this.leaveRequestList = result.data;
        this.dataSource = new MatTableDataSource(this.leaveRequestList)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showTable = true;
      })
  }

  leaveCalculation() {
    this.manageLeaveService.getTotalLeaves().subscribe(
      (res: any) => {
        this.leaveData = res.data;
      })
  }

  createLeaveRequest() {
    this.manageLeaveService.createLeaveRequest({
      fromDate: this.fromDate, toDate: this.toDate, halfday: this.isvalid,
      type: this.leaveRequestForm.get('type').value, status: "pending",
      reason: this.leaveRequestForm.get('reason').value
    }).subscribe(
      (res: any) => {
        console.log(res)
        this.filterRequestLeave();
        this.leaveCalculation();
        this.formReset();
      })
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  updateStatus(leaveId) {
    this.manageLeaveService.updateStatus({ leaveId }).subscribe(
      (result: any) => {
        console.log(result)
        this.filterRequestLeave();
      })
  }

  getFromDate(date) {
    if (date != null) {
      this.fromDate = date;
      if (this.toDate) {
        this.getNoOfDays(this.toDate)
      }
    }
  }
  gethalfday(value) {
    if (this.totaldaysOff == 1 && value) {
      this.leaveRequestForm.get("totalDays").setValue(this.totaldaysOff / 2);
    } else {
      this.leaveRequestForm.get("totalDays").setValue(this.totaldaysOff);
    }
  }

  getAllHolidayList() {
    this.holidayService.getHolidayList().subscribe((res: any) => {
      this.holidayList = res.data;
      this.holidayList.forEach(x => {
        var date = new Date(x.holidayDate)
        x.holidayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
      })
      this.holidayList = this.holidayList.map(x => x.holidayDate);
      console.log(this.holidayList)

    })
  }

  getDayoff() {
    this.dayoffService.getDayoffList().subscribe((res: any) => {
      this.dayOffList = res.data.map(x => x.weekdayOff);
      console.log(this.dayOffList)
    })
  }

  getNoOfDays(val) {
    this.toDate = val
    if (val != null) {
      if (val) {
        var Difference_In_Time = val.getTime() - this.fromDate.getTime();
        //  this.leaveRequestForm.get("totalDays").setValue(((Difference_In_Time / (1000 * 3600 * 24)) + 1));
        // this.totaldaysOff = ((Difference_In_Time / (1000 * 3600 * 24)) + 1);
        if (((Difference_In_Time / (1000 * 3600 * 24)) + 1) <= 0) {
          this.invalidDate = true;
        } else {
          this.invalidDate = false;
        }
      }
      var totaldate = []
      let fromdate = new Date(this.fromDate)
      let todate = new Date(this.toDate)
      for (let date = fromdate.getDate(); date <= todate.getDate(); date++) {
        let day: Date = new Date(fromdate);
        totaldate.push(day);
        fromdate.setDate(fromdate.getDate() + 1);
      }
      console.log(totaldate)
      totaldate.forEach(x => {

        if (x.getDay() == 0) {
          x.day = 'sunday'
        }
        if (x.getDay() == 1) {
          x.day = 'monday'
        }
        if (x.getDay() == 2) {
          x.day = 'tuesday'
        }
        if (x.getDay() == 3) {
          x.day = 'wednesday'
        }
        if (x.getDay() == 4) {
          x.day = 'thursday'
        }
        if (x.getDay() == 5) {
          x.day = 'friday'
        }
        if (x.getDay() == 6) {
          x.day = 'saturday'
        }
      })
      console.log(totaldate)

      let y = totaldate.filter(x => !this.dayOffList.includes(x.day) && !this.holidayList.includes((new Date(x).getMonth() + 1) + '/' + new Date(x).getDate() + '/' + new Date(x).getFullYear()))
      console.log(y)
      this.leaveRequestForm.get("totalDays").setValue(y.length);
      this.totaldaysOff = y.length;
      if (y.length == 1) {
        this.isvalid = true;

      } else {
        this.isvalid = false;
      }

    }
  }
}
