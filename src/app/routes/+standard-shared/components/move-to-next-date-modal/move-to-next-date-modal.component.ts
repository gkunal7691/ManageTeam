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

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newEstimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newDate: [''],
      newNextDate: ['']
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.task)
  }

}
