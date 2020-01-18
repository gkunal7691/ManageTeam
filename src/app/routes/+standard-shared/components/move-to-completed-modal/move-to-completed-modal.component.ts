import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-move-to-completed-modal',
  templateUrl: './move-to-completed-modal.component.html',
  styleUrls: ['./move-to-completed-modal.component.scss']
})
export class MoveToCompletedModalComponent implements OnInit {

  constructor(private fb:FormBuilder) { }

  estimateTimeModalForm:FormGroup;

  ngOnInit() {
    this.estimateTimeModalForm = this.fb.group({
      newOriginalHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newOriginalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newClientHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newClientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]]
    })
  }

}
