import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TaskService } from '../../../../services/task.service';
const swal = require('sweetalert');

@Component({
  selector: 'app-move-to-completed-modal',
  templateUrl: './move-to-completed-modal.component.html',
  styleUrls: ['./move-to-completed-modal.component.scss']
})

export class MoveToCompletedModalComponent implements OnInit {
  @Input() task: any;
  @Input() totalEstimatedTime: number;
  @Output() updateTaskList = new EventEmitter();

  estimateTimeModalForm: FormGroup;

  constructor(private fb: FormBuilder, private taskService: TaskService) { }

  ngOnInit() {
    this.estimateTimeModalForm = this.fb.group({
      newOriginalHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newOriginalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newClientHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newClientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]]
    })
  }

  cancelTask() {
    var x = document.getElementById("testing")
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.estimateTimeModalForm.reset();
  }

  addNewEstimateTime() {
    let newClientHour = this.estimateTimeModalForm.get('newClientHour').value;
    let newClientMin = this.estimateTimeModalForm.get('newClientMin').value;
    let totalClientTime = (newClientHour * 60) + newClientMin;
    let newOriginalHour = this.estimateTimeModalForm.get('newOriginalHour').value;
    let newOriginalMin = this.estimateTimeModalForm.get('newOriginalMin').value;
    let totalOriginalTime = (newOriginalHour * 60) + newOriginalMin;

    this.taskService.editTask({
      originalTime: totalOriginalTime, clientTime: totalClientTime, taskId: this.task.taskId, status: 'completed', dueDate: this.task.dueDate
    }).subscribe((res: any) => {
      swal('Success', 'Task(#' + this.task.taskId + ') has been moved to completed tasks', 'success');
      this.updateTaskList.emit();
      this.cancelTask();
    })
  }

}
