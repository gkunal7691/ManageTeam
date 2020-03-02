import { Component, OnInit } from '@angular/core';
import { DayoffService } from '../../../../services/dayoff.service';
import { EmployeeService } from '../../../../services/employee.service';
import { LoginService } from '../../../../services/login.service';
import { TaskService } from '../../../../services/task.service';
import { ColorsService } from '../../../../shared/colors/colors.service';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss']
})

export class MonthViewComponent implements OnInit {

  userId: any;
  userList: any;

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
  lastDay: number;
  firstDate: Date;
  lastDate: Date;
  hideMonday: boolean = true;
  hideTuesday: boolean = true;
  hideWednesday: boolean = true;
  hideThrusday: boolean = true;
  hideFriday: boolean = true;
  hideSaturday: boolean = true;
  hideSunday: boolean = true;
  showLoader: boolean = true;
  weekdayIds: any;
  dueDate: any;
  monthdate: Date;
  taskList: any[] = []
  leaveRequestList: any[] = [];
  noofWorkingDays: number;
  totalWeekOffDays: number;
  totalHolidays: any;
  totalSpentTime: any;
  totalClientTime: any;

  pieOptions4 = {
    animate: {
      duration: 800,
      enabled: true
    },
    barColor: this.colors.byName('danger'),
    trackColor: this.colors.byName('yellow'),
    lineWidth: 10,
    lineCap: 'circle'
  };

  doughnutOptions = {
    responsive: true
  };

  doughnutData = {};

  doughnutColors = [{
    borderColor: [
      this.colors.byName('danger'),
      this.colors.byName('warning'),
      this.colors.byName('success')
    ],
    backgroundColor: [
      this.colors.byName('danger'),
      this.colors.byName('warning'),
      this.colors.byName('success')
    ],
  }];

  constructor(private dayoffService: DayoffService, private taskService: TaskService,
    public colors: ColorsService, public logService: LoginService, private employeeService: EmployeeService) {
    this.userId = this.logService.currentUser.id;
  }

  ngOnInit() {
    this.totalHolidays = 0;
    this.divHeight = window.outerHeight + 'px';
    this.presentdate = new Date();
    this.createMonthDateArray(new Date());
    this.getDayoff();
    this.getUserList();
  }

  createMonthDateArray(date) {
    this.monthdate = date;
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
    this.getUpdatedTaskList();
    this.getDayoff();
    this.showWeekoff(true);
  }

  getPreviousMonth() {
    let predate = new Date(this.presentdate.setMonth(this.presentdate.getMonth() - 1))
    this.presentdate = predate;
    this.monthArray = []
    this.createMonthDateArray(predate)
  }

  getNextMonth() {
    let nextdate = new Date(this.presentdate.setMonth(this.presentdate.getMonth() + 1))
    this.presentdate = nextdate;
    this.monthArray = []
    this.createMonthDateArray(nextdate)
  }

  selectedUserTask(value) {
    this.userId = value;
    this.getUpdatedTaskList();
  }

  getUpdatedTaskList() {
    this.showLoader = true;
    this.taskList = [];
    this.taskService.getTaskList(new Date(this.monthdate), this.userId).subscribe((res: any) => {
      this.taskList = res.data;
      console.log(this.taskList)
      this.showLoader = false;
      this.totalSpentTime = 0;
      this.totalClientTime = 0;
      this.taskList.forEach(time => {
        this.totalSpentTime += time.totalEstimatedTime;
        this.totalClientTime += time.totalClientTime;

        if (new Date(time.taskDate).getDay() == 0) {
          time.day = 'sunday';
        }
        if (new Date(time.taskDate).getDay() == 1) {
          time.day = 'monday';
        }
        if (new Date(time.taskDate).getDay() == 2) {
          time.day = 'tuesday';
        }
        if (new Date(time.taskDate).getDay() == 3) {
          time.day = 'wednesday';
        }
        if (new Date(time.taskDate).getDay() == 4) {
          time.day = 'thursday';
        }
        if (new Date(time.taskDate).getDay() == 5) {
          time.day = '5';
        }
        if (new Date(time.taskDate).getDay() == 6) {
          time.day = 'saturday';
        }
      })
      this.calculateDaysLeft();
    });
  }

  getDayoff() {
    this.dayoffService.getDayoffList().subscribe((res: any) => {
      this.weekdayIds = res.data.map(id => id.weekdayId);
      this.showWeekoff(true);

      for (let i = 0; i < this.weekdayIds.length; i++) {
        if (this.weekdayIds[i] == 1) {
          this.weekdayIds[i] = 'monday';
        }
        else if (this.weekdayIds[i] == 2) {
          this.weekdayIds[i] = 'tuesday';
        }
        else if (this.weekdayIds[i] == 3) {
          this.weekdayIds[i] = 'wednesday';
        }
        else if (this.weekdayIds[i] == 4) {
          this.weekdayIds[i] = 'thursday';
        }
        else if (this.weekdayIds[i] == 5) {
          this.weekdayIds[i] = 'friday';
        }
        else if (this.weekdayIds[i] == 6) {
          this.weekdayIds[i] = 'saturday';
        }
        else if (this.weekdayIds[i] == 7) {
          this.weekdayIds[i] = 'sunday';
        }
      }
    })
  }

  showWeekoff(value) {
    if (value && this.weekdayIds) {
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
          this.hideSunday = false;
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

  getUserList() {
    this.employeeService.getEmployeeList().subscribe(
      (res: any) => {
        this.userList = res.data;
      })
  }

  onGetModalDate(val) {
    this.dueDate = val;
  }

  calculateDaysLeft() {
    let y = this.taskList.filter(x => (x.holiday == null) && (!this.weekdayIds.includes(x.day)));
    this.noofWorkingDays = y.length;

    if (this.taskList != null) {
      this.doughnutData = {
        labels: [
          'Working Hours',
          'Spent Time',
          'Client Time'
        ],
        datasets: [{
          // data: [((this.noofWorkingDays * 8) * 60), (this.totalSpentTime), this.totalClientTime]
          data: [100, 50, 25]
        }]
      }
    }
  }

}
