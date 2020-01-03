import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DayoffService } from '../../../services/dayoff.service';
import { WeekdayService } from '../../../services/weekday.service';

@Component({
  selector: 'app-day-off',
  templateUrl: './day-off.component.html',
  styleUrls: ['./day-off.component.scss']
})
export class DayOffComponent implements OnInit {

  addDayoffForm: FormGroup;
  editdayoffForm: FormGroup;
  dayOffNameList: any[] = [];
  sortedDaysList: any[] = [];
  weekdayList: any[] = [];
  slicedDays: any[] = [];
  addDayoff: boolean = true;


  public days: Array<string> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  public value: any = {};
  public _disabledV: string = '0';
  public disabled: boolean = false;

  public set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public typed(value: any): void {
    console.log('New search input: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  constructor(private fb: FormBuilder, private dayoffService: DayoffService, private weekdayService: WeekdayService) { }

  ngOnInit() {
    this.addDayoffForm = this.fb.group({
      weekdayoff: [null, [Validators.required]],
    });

    this.editdayoffForm = this.fb.group({
      dayOffIds: [''],
    });
    this.getWeekDay();
    this.getDayoff();
  }

  formReset() {
    this.addDayoffForm.reset();
  }

  filterDayOff() {
    let dayresponseList = this.dayOffNameList.map(day => day.weekdayOff)
    this.sortedDaysList = this.days.filter(day => { return !dayresponseList.includes(day) })
    console.log(this.sortedDaysList)
  }

  getWeekDay() {
    this.weekdayService.getWeekDay().subscribe((res: any) => {
      console.log(res);
      this.weekdayList = res.data;
    })
  }


  getDayoff() {
    this.dayoffService.getDayoffList().subscribe((res: any) => {
      console.log(res.data)
      let presentdayIds = res.data.map(id => id.weekdayId)
      let weekdayIds  = this.weekdayList.map(id => id.weekdayId)
      console.log(presentdayIds)
      console.log(weekdayIds)
      let m1= [];
      m1.push(presentdayIds,weekdayIds) 
      console.log(m1)
      console.log(this.slicedDays)
      this.dayOffNameList = res.data;
      this.dayOffNameList.forEach(days => {
        let dayName;
        if (days.weekdayId == 1) {
          dayName = 'Monday'
        }
        if (days.weekdayId == 2) {
          dayName = 'Tuesday'
        }
        if (days.weekdayId == 3) {
          dayName = 'Wednesday'
        }
        if (days.weekdayId == 4) {
          dayName = 'Thursday'
        }
        if (days.weekdayId == 5) {
          dayName = 'Friday'
        }
        if (days.weekdayId == 6) {
          dayName = 'Saturday'
        }
        if (days.weekdayId == 7) {
          dayName = 'Sunday'
        }
        days.weekdayId = dayName;
      })
      console.log(this.dayOffNameList)
      let dayOffIds = this.dayOffNameList.map(id => id.dayoffId)
      console.log(dayOffIds)
      this.editdayoffForm.get('dayOffIds').setValue(dayOffIds);
      if (this.dayOffNameList != null) {
        this.addDayoff = false;
        this.filterDayOff();
      }
      else {
        this.addDayoff = true;
      }
    })
  }

  createDayoff() {
    this.dayoffService.createDayoffList(this.addDayoffForm.get('weekdayoff').value).subscribe((res: any) => {
      console.log(res);
      this.getDayoff();
    })
  }


  updateDayoff() {
    this.dayoffService.updateDayoff({ dayoffId: this.editdayoffForm.get('dayOffIds').value }).subscribe((res: any) => {
      console.log(res);
      this.getDayoff();
    })
  }
}
