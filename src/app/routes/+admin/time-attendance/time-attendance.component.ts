import { Component, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { DayoffService } from '../../../services/dayoff.service';
import { HolidayService } from '../../../services/holiday.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-time-attendance',
  templateUrl: './time-attendance.component.html',
  styleUrls: ['./time-attendance.component.scss']
})

export class TimeAttendanceComponent implements OnInit {

  constructor(private dayoffService: DayoffService, private holidayService: HolidayService,
    private taskService: TaskService, private userService: SuperAdminService) { }

  divHeight: any;
  monthArray = [];
  mondayArray = [];
  tuesdayArray = [];
  wednesdayArray = [];
  thrusdayArray = [];
  fridayArray = [];
  saturdayArray = [];
  sundayArray = [];
  firstDayofMonth;
  presentdate: any
  firstDay: any;
  lastDay: any;
  firstDate: Date;
  lastDate: Date;
  hideMonday: boolean = true;
  hideTuesday: boolean = true;
  hideWednesday: boolean = true;
  hideThrusday: boolean = true;
  hideFriday: boolean = true;
  hideSaturday: boolean = true;
  hideSunday: boolean = true;
  showLoader:boolean = true;
  iscurrentDate: any;
  weekdayIds: any;
  holidayList = [];
  recentDateClicked: any;
  taskList: any[] = [];
  userList: any[] = [];
  selectedUserId: number;

  ngOnInit() {
    this.divHeight = window.innerHeight + 'px';
    this.presentdate = new Date();
    this.createMonthDateArray(new Date());
    this.getDayoff();
    this.getHolidayList();
    this.getUserList();

  }

  showWeekoff(value) {
    if (value) {
      this.weekdayIds.forEach(id => {
        if (id == 1) {
          this.mondayArray = [];
          this.hideMonday = false;
        }
        else if (id == 2) {
          this.tuesdayArray = [];
          this.hideTuesday = false;
        }
        else if (id == 3) {
          this.hideWednesday = false;
          this.wednesdayArray = [];
        }
        else if (id == 4) {
          this.thrusdayArray = [];
          this.hideThrusday = false;
        }
        else if (id == 5) {
          this.fridayArray = [];
          this.hideFriday = false;
        }
        else if (id == 6) {
          this.saturdayArray = [];
          this.hideSaturday = false;
        }
        else if (id == 7) {
          this.sundayArray = [];
          this.hideSaturday = false;
        }
        else {
          this.hideMonday = true;
          this.hideTuesday = true;
          this.hideWednesday = true;
          this.hideThrusday = true;
          this.hideFriday = true;
          this.hideSaturday = true;
          this.hideSunday = true;
          this.splitWeekWise();
        }
      });
    }
    else {
      this.hideMonday = true;
      this.hideTuesday = true;
      this.hideWednesday = true;
      this.hideThrusday = true;
      this.hideFriday = true;
      this.hideSaturday = true;
      this.hideSunday = true;
      this.splitWeekWise();
    }
  }

  getPreviousMonth() {
    let predate = new Date(this.presentdate.setMonth(this.presentdate.getMonth() - 1))
    this.presentdate = predate
    this.monthArray = []
    this.createMonthDateArray(predate)
  }

  getNextMonth() {
    let nextdate = new Date(this.presentdate.setMonth(this.presentdate.getMonth() + 1))
    this.presentdate = nextdate
    this.monthArray = []
    this.createMonthDateArray(nextdate)
  }

  createMonthDateArray(date) {
    this.firstDayofMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    this.firstDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.firstDay = this.firstDate.getDate();
    this.lastDay = this.lastDate.getDate();

    while (this.firstDate <= this.lastDate) {
      let day: Date = new Date(this.firstDate);
      this.monthArray.push(day);
      this.firstDate.setDate(this.firstDate.getDate() + 1);
    }
    this.splitWeekWise();
    var today = new Date();
    this.monthArray.forEach(d => {
      var currentDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var monthDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      if (monthDate == currentDate) {
        this.iscurrentDate = d;
      }
    })
    this.getUpdatedTaskList();
  }

  selectedUserTask(value) {
    console.log(value)
    this.selectedUserId = value;
    this.getUpdatedTaskList();
  }

  getUpdatedTaskList() {
    let firstdate = new Date(this.firstDate)
    let FirstDay;
    if (firstdate.getMonth() == 0) {
      FirstDay = (firstdate.getFullYear() - 1) + '-' + (firstdate.getMonth() + 12) + '-' + firstdate.getDate()
    }
    else {
      FirstDay = firstdate.getFullYear() + '-' + firstdate.getMonth() + '-' + firstdate.getDate()
    }
    let lastdate = new Date(this.lastDate)
    let LastDay = lastdate.getFullYear() + '-' + (lastdate.getMonth() + 1) + '-' + lastdate.getDate()
    this.showLoader  = true;
    this.taskList = [];
    this.taskService.getEachUserTask({ firstDay: FirstDay, lastDay: LastDay, userId: this.selectedUserId }).subscribe((res: any) => {
      this.taskList = res.data;
      this.showLoader = false;
    })
  }

  getDayoff() {
    this.dayoffService.getDayoffList().subscribe((res: any) => {
      this.weekdayIds = res.data.map(id => id.weekdayId)
    })
  }

  splitWeekWise() {
    this.mondayArray = this.monthArray.filter(day => day.getDay() == 1);
    this.tuesdayArray = this.monthArray.filter(day => day.getDay() == 2);
    this.wednesdayArray = this.monthArray.filter(day => day.getDay() == 3);
    this.thrusdayArray = this.monthArray.filter(day => day.getDay() == 4);
    this.fridayArray = this.monthArray.filter(day => day.getDay() == 5);
    this.saturdayArray = this.monthArray.filter(day => day.getDay() == 6);
    this.sundayArray = this.monthArray.filter(day => day.getDay() == 0);

    if (this.firstDayofMonth.getDay() == 0) {
      this.mondayArray.unshift({});
      this.tuesdayArray.unshift({});
      this.wednesdayArray.unshift({});
      this.thrusdayArray.unshift({});
      this.fridayArray.unshift({});
      this.saturdayArray.unshift({});
    }
    else {
      if (this.firstDayofMonth.getDay() > 1) {
        this.mondayArray.unshift({});
      }
      if (this.firstDayofMonth.getDay() > 2) {
        this.tuesdayArray.unshift({});
      }
      if (this.firstDayofMonth.getDay() > 3) {
        this.wednesdayArray.unshift({});
      }
      if (this.firstDayofMonth.getDay() > 4) {
        this.thrusdayArray.unshift({});
      }
      if (this.firstDayofMonth.getDay() > 5) {
        this.fridayArray.unshift({});
      }
      if (this.firstDayofMonth.getDay() > 6) {
        this.saturdayArray.unshift({});
      }
      if ((this.firstDayofMonth.getDay() - 6) > 0) {
        this.sundayArray.unshift({});
      }
    }
  }

  getHolidayList() {
    this.holidayService.getHolidayList().subscribe((res: any) => {
      this.holidayList = res.data;
      this.holidayList.forEach(dates => {
        let date = new Date(dates.holidayDate)
        dates.holidayDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
      })
      this.holidayList = this.holidayList.map(i => ({ holidayDate: i.holidayDate, occasion: i.occasion, holidayType: i.holidayType }))
      this.showWeekoff(true);
    })
  }

  onGetModalDate(val) {
    this.recentDateClicked = val;
  }

  getUserList() {
    this.userService.getUserList().subscribe(
      (res: any) => {
        this.userList = res.data;
      })
  }

}
