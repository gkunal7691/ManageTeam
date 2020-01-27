import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
const swal = require('sweetalert');

@Component({
  selector: 'app-move-to-next-date-modal',
  templateUrl: './move-to-next-date-modal.component.html',
  styleUrls: ['./move-to-next-date-modal.component.scss']
})

export class MoveToNextDateModalComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (this.task && this.nextDateModalForm) {
      this.nextDateModalForm.get('assignee').setValue(this.task.userId)
    }
  }

  @Input() task: any;
  @Output() updateTaskList = new EventEmitter();
  @Input() dueDate: any;
  @Input() userList: [];

  nextDate: any;
  totalEstimatedTime: number;
  showDateSection: boolean;
  showCalendar: boolean = true;
  nextDateModalForm: FormGroup;
  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  constructor(private fb: FormBuilder, private taskService: TaskService, public router: Router) { }

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.maxLength(2), Validators.max(8), Validators.required]],
      newEstimatedMin: ['', [Validators.maxLength(2), Validators.max(59), Validators.required]],
      newDate: ['', [Validators.required]],
      assignee: ['', [Validators.required]],
    });
  }

  cancelTask() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.nextDateModalForm.reset();
  }

  selectAssignee(value) {
    if (value == '') {
      this.nextDateModalForm.get('newDate').reset()
    }
  }

  getNewDate(val) {
    if (val) {
      this.nextDate = new Date(val);
      this.nextDate.setHours(0, 0, 0);
      this.getSelectedDayTask();
    }
  }

  getSelectedDayTask() {
    if (this.nextDate) {
      let dueDate = this.nextDate.getFullYear() + '-' + (this.nextDate.getMonth() + 1) + '-' + this.nextDate.getDate();
      this.taskService.getSelectedDateTask(this.nextDateModalForm.get('assignee').value, dueDate).subscribe((res: any) => {
        this.totalEstimatedTime = res.data;
      })
    }
  }

  moveTask() {
    let newEstimatedHour = this.nextDateModalForm.get('newEstimatedHour').value;
    let newEstimatedMin = this.nextDateModalForm.get('newEstimatedMin').value;
    let totalEstimatedTime = (newEstimatedHour * 60) + newEstimatedMin;

    if (this.nextDate) {
      let currentDate = new Date();
      let taskDate = new Date(this.task.dueDate);
      let newDate = (new Date(this.nextDate).getMonth() + 1) + '/' +
        (new Date(this.nextDate).getDate()) + '/' + (new Date(this.nextDate).getFullYear());
      if (currentDate.getDate() == taskDate.getDate()) {
        this.taskService.addTask({
          title: this.task.title, description: this.task.description,
          dueDate: this.nextDate, priority: this.task.priority, status: this.task.status,
          estimatedTime: totalEstimatedTime, originalTime: this.task.originalTime, clientTime: this.task.clientTime,
          assignee: this.nextDateModalForm.get('assignee').value,
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(#' + this.task.taskId + ') has been moved to ' + newDate, 'success');
        })
        this.taskService.editTask({
          taskId: this.task.taskId, clonned: 1, dueDate: this.task.dueDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
        });
      }
      else if (taskDate.getFullYear() == 1970 || taskDate.getDate() > currentDate.getDate()) {
        this.nextDate.setHours(this.nextDate.getHours() + 5, 30)
        this.taskService.editTask({
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(#' + this.task.taskId + ') has been moved to ' + newDate, 'success');
        });
      }
    }
  }

  moveToNextDate() {
    if (this.router.url == '/employee/backlog' && this.dueDate != null) {
      let addnextDate = (new Date(this.dueDate).getMonth() + 1) + '/' +
        (new Date(this.dueDate).getDate() + 1) + '/' + (new Date(this.dueDate).getFullYear());
      this.nextDateModalForm.get('newDate').setValue(new Date(addnextDate).getDate() + 1);
      this.nextDate = new Date(addnextDate);
      this.getNewDate(addnextDate);
    }
    else {
      let addnextDate = (new Date(this.task.dueDate).getMonth() + 1) + '/' +
        (new Date(this.task.dueDate).getDate() + 1) + '/' + (new Date(this.task.dueDate).getFullYear());
      this.nextDateModalForm.get('newDate').setValue(new Date(addnextDate).getDate() + 1);
      this.nextDate = new Date(addnextDate);
      this.getNewDate(addnextDate);
    }
  }

}
