import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-move-to-next-date-modal',
  templateUrl: './move-to-next-date-modal.component.html',
  styleUrls: ['./move-to-next-date-modal.component.scss']
})
export class MoveToNextDateModalComponent implements OnInit, OnChanges {

  @Input() task: any;

  constructor(private fb: FormBuilder) { }

  nextDateModalForm: FormGroup;
  calenderDate: any;
  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newEstimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newDate: [''],
      newNextDate: ['']
    })
    console.log(this.task)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.task)
  }

  getNewDate(val) {
    this.calenderDate = val;
    console.log(this.calenderDate);
  }

  moveTask() {

  }

  // moveToNextDate() {
  //   this.nextDateValue = false;
  //   console.log(this._date);
  //   let addnextDate = (new Date(this._date).getMonth() + 1) + '/' +
  //     (new Date(this._date).getDate() + 1) + '/' + (new Date(this._date).getFullYear());
  //   this.nextDate = new Date(addnextDate);
  //   this.nextDate.setHours(this.nextDate.getHours() + 5, 30);
  //   console.log(this.nextDate);
  //   this.nextDateModalForm.get('newNextDate').setValue(addnextDate);

  //   this.getNewDate(addnextDate);
  // }


}
