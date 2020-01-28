import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ManageLeaveService } from '../../../services/manage-leave.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HolidayService } from '../../../services/holiday.service';
import { DayoffService } from '../../../services/dayoff.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
declare var swal: any;

@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.scss']
})

export class ManageLeaveComponent implements OnInit, AfterViewInit {
  isPastDate: boolean;

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
  // addedLeave: boolean;
  allLeave: boolean;
  totaldaysOff: any;
  invalidDate: boolean;
  holidayList: any;
  dayOffList: any;
  isvalid: boolean;
  isHalfDay: boolean = false;
  selectedStartDate: any;
  selectedEndDate: any;
  leaveOffDays: any;

  displayedColumns: string[] = ["fromDate", "toDate", "noOfdays", "type", "reason", "status", "createdAt", "choose_response"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private manageLeaveService: ManageLeaveService, private fb: FormBuilder,
    private holidayService: HolidayService, private dayoffService: DayoffService) { }

  leaveRequestList: any[] = [];

  ngOnInit() {
    this.leaveRequestForm = this.fb.group({
      dates: [],
      totalDays: [{ value: '', disabled: true }],
      type: ['', [Validators.required]],
      reason: ['', [Validators.required]]
    })
    this.pendingLeave = true;
    this.approvedLeave = false;
    this.rejectedLeave = false;
    // this.addedLeave = false;
    this.allLeave = false;
    this.cancelledLeave = false;

    this.filterRequestLeave();
    this.leaveCalculation();
    this.getDayoff();
    this.getAllHolidayList();

  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  leaveRequestFormReset() {
    this.leaveRequestForm.reset();
    this.leaveRequestForm.get('type').setValue('')
    this.selectedEndDate = null;
    this.selectedStartDate = null;
    this.isvalid = false;
    this.isPastDate = false;
  }

  pending(value) {
    this.pendingLeave = value;
    this.allLeave = false;
    this.filterRequestLeave();
  }

  approve(value) {
    this.approvedLeave = value;
    this.allLeave = false;
    this.filterRequestLeave();
  }

  reject(value) {
    this.rejectedLeave = value;
    this.allLeave = false;
    this.filterRequestLeave();
  }

  // add(value) {
  //   this.addedLeave = value;
  //   this.allLeave = false;
  //   this.filterRequestLeave();
  // }

  cancel(value) {
    this.cancelledLeave = value;
    this.allLeave = false;
    this.filterRequestLeave();
  }

  all(value) {
    this.allLeave = value;
    this.approvedLeave = value;
    this.cancelledLeave = value;
    // this.addedLeave = value;
    this.rejectedLeave = value;
    this.pendingLeave = value;
    this.filterRequestLeave();
  }

  filterRequestLeave() {
    let status = {};
    status['ispending'] = this.pendingLeave;
    status['isapprove'] = this.approvedLeave;
    status['isreject'] = this.rejectedLeave;
    // status['isadd'] = this.addedLeave;
    status['iscancel'] = this.cancelledLeave;

    this.manageLeaveService.getManageLeaveList(status).subscribe(
      (result: any) => {
        this.leaveRequestList = result.data;
        this.dataSource = new MatTableDataSource(this.leaveRequestList);
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
        this.filterRequestLeave();
        this.leaveCalculation();
        this.fromDate = this.fromDate.getDate() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getFullYear();
        this.toDate = this.toDate.getDate() + '/' + (this.toDate.getMonth() + 1) + '/' + this.toDate.getFullYear();
        swal('Success', 'Leave request for '+ this.leaveRequestForm.get("totalDays").value +
          ' days(' +this.fromDate +' - '+ this.toDate +') successfully sent :)', 'success');
        this.leaveRequestFormReset();
      })
  }

  cancelLeaveRequestSwal(value) {
    let totalLeaveDays = value.noOfdays;
    if (totalLeaveDays < 0)
      totalLeaveDays = Math.abs(totalLeaveDays);
    swal({
      title: "Are you sure ?",
      text: "Leave request for " + totalLeaveDays + " days will be cancelled!",
      icon: "warning",
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        this.cancelLeaveRequestPopUp(value);
      } else {
        swal('Cancelled', 'Leave request for '+ totalLeaveDays +' days is not removed :)', 'error');
      }
    });
  }

  cancelLeaveRequestPopUp(value) {
    let leaveId = value.leaveId;
    let totalLeaveDays = value.noOfdays;
    if (totalLeaveDays < 0)
      totalLeaveDays = Math.abs(totalLeaveDays);
    this.manageLeaveService.updateStatus({ leaveId }).subscribe(
      (result: any) => {
        swal('Deleted', 'Leave request for '+ totalLeaveDays +' days has been removed :)', 'warning');
        this.filterRequestLeave();
      })
  }

  getFromDate(date) {
    if (date != null) {
      this.fromDate = date;
      let currentDate: Date = new Date();
      var noOfDates = this.fromDate.getDate() - currentDate.getDate();
      if (noOfDates < 0) {
        this.isPastDate = true;
      } else {
        this.isPastDate = false;
      }
      if (this.toDate) {
        this.getNoOfDays(this.toDate);
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
        var date = new Date(x.holidayDate);
        x.holidayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      })
      this.holidayList = this.holidayList.map(x => x.holidayDate);
    })
  }

  getDayoff() {
    this.dayoffService.getDayoffList().subscribe((res: any) => {
      this.dayOffList = res.data.map(x => x.weekdayId);
      for (let i = 0; i < this.dayOffList.length; i++) {
        if (this.dayOffList[i] == 0) {
          this.dayOffList[i] = 'sunday';
        }
        else if (this.dayOffList[i] == 1) {
          this.dayOffList[i] = 'monday';
        }
        else if (this.dayOffList[i] == 2) {
          this.dayOffList[i] = 'tuesday';
        }
        else if (this.dayOffList[i] == 3) {
          this.dayOffList[i] = 'wednesday';
        }
        else if (this.dayOffList[i] == 4) {
          this.dayOffList[i] = 'thursday';
        }
        else if (this.dayOffList[i] == 5) {
          this.dayOffList[i] = 'friday';
        }
        else if (this.dayOffList[i] == 6) {
          this.dayOffList[i] = 'saturday';
        }
      }
    })
  }

  getNoOfDays(val) {
    this.toDate = val;
    if (val != null && this.fromDate != undefined) {
      if (val) {
        var Difference_In_Time =  this.toDate.getTime() - this.fromDate.getTime();
        if (((Difference_In_Time / (1000 * 3600 * 24)) + 1) <= 0) {
          this.invalidDate = true;
        } else {
          this.invalidDate = false;
        }
      }
      var totaldate = [];
      let fromdate = new Date(this.fromDate);
      let todate = new Date(this.toDate);
      for (let date = fromdate.getDate(); date <= todate.getDate(); date++) {
        let day: Date = new Date(fromdate);
        totaldate.push(day);
        fromdate.setDate(fromdate.getDate() + 1);
      }
      console.log(totaldate);
      totaldate.forEach(x => {
        if (x.getDay() == 0) {
          x.day = 'sunday';
        }
        if (x.getDay() == 1) {
          x.day = 'monday';
        }
        if (x.getDay() == 2) {
          x.day = 'tuesday';
        }
        if (x.getDay() == 3) {
          x.day = 'wednesday';
        }
        if (x.getDay() == 4) {
          x.day = 'thursday';
        }
        if (x.getDay() == 5) {
          x.day = 'friday';
        }
        if (x.getDay() == 6) {
          x.day = 'saturday';
        }
      })

      let y = totaldate.filter(x => !this.dayOffList.includes(x.day) &&
        !this.holidayList.includes((new Date(x).getMonth() + 1) + '/' + new Date(x).getDate() + '/' + new Date(x).getFullYear()));
      console.log(y.length);
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
