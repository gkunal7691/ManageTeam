import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task.service';
import { Router } from '@angular/router';
const swal = require('sweetalert');

@Component({
  selector: 'app-move-to-next-date-modal',
  templateUrl: './move-to-next-date-modal.component.html',
  styleUrls: ['./move-to-next-date-modal.component.scss']
})

export class MoveToNextDateModalComponent implements OnInit {
  @Input() task: any;
  @Input() totalEstimatedTime: number;
  @Output() updateTaskList = new EventEmitter();
  @Input() dueDate: any;

  nextDate: any;
  showCalendar: boolean = true;
  nextDateModalForm: FormGroup;
  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  constructor(private fb: FormBuilder, private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newEstimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newDate: [''],
      newNextDate: ['']
    })
  }

  cancelTask() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.nextDateModalForm.reset();
  }

  getNewDate(val) {
    this.nextDate = new Date(val);
    this.nextDate.setHours(0, 0, 0);
    if (this.nextDateModalForm.get('newNextDate').value == '') {
      this.showCalendar = true;
    }
  }

  moveTask() {
    let newEstimatedHour = this.nextDateModalForm.get('newEstimatedHour').value;
    let newEstimatedMin = this.nextDateModalForm.get('newEstimatedMin').value;
    let totalEstimatedTime = (newEstimatedHour * 60) + newEstimatedMin;

    if (this.nextDate) {
      this.taskService.editTask({
        taskId: this.task.taskId, clonned: 1, dueDate: this.task.dueDate
      }).subscribe((res: any) => { });

      this.taskService.addTask({
        title: this.task.title, description: this.task.description,
        dueDate: this.nextDate, priority: this.task.priority, status: this.task.status,
        estimatedTime: totalEstimatedTime, originalTime: this.task.originalTime, clientTime: this.task.clientTime,
        assignee: this.task.userId,
      }).subscribe((res: any) => {
        let newDate = (new Date(this.nextDate).getMonth() + 1) + '/' +
          (new Date(this.nextDate).getDate()) + '/' + (new Date(this.nextDate).getFullYear());
        if (res.data == 'Error Cant Add') {
          swal('Warning', 'Task(#' + this.task.taskId + ') can not be moved to ' + newDate, 'error');
        }
        else {
          swal('Success', 'Task(#' + this.task.taskId + ') has been moved to ' + newDate, 'success');
        }
        this.updateTaskList.emit();
        this.showCalendar = true;
        this.cancelTask();
      })
    }
  }

  moveToNextDate() {
    this.showCalendar = false;
    if (this.router.url == '/employee/backlog' && this.dueDate != null) {
      let addnextDate = (new Date(this.dueDate).getMonth() + 1) + '/' +
        (new Date(this.dueDate).getDate() + 1) + '/' + (new Date(this.dueDate).getFullYear());
      this.nextDateModalForm.get('newNextDate').setValue(addnextDate);
      this.nextDate = new Date(addnextDate);
      this.getNewDate(addnextDate);
    }
    else {
      let addnextDate = (new Date(this.task.dueDate).getMonth() + 1) + '/' +
        (new Date(this.task.dueDate).getDate() + 1) + '/' + (new Date(this.task.dueDate).getFullYear());
      this.nextDateModalForm.get('newNextDate').setValue(addnextDate);
      this.nextDate = new Date(addnextDate);
      this.getNewDate(addnextDate);
    }
  }

}
