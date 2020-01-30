import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
declare var swal: any;

@Component({
  selector: 'app-move-to-next-date-modal',
  templateUrl: './move-to-next-date-modal.component.html',
  styleUrls: ['./move-to-next-date-modal.component.scss']
})

export class MoveToNextDateModalComponent implements OnInit, OnChanges {
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if (this.task && this.nextDateModalForm) {
      this.nextDateModalForm.get('assignee').setValue(this.task.userId)
      this.ref.detectChanges();;
    }
  }

  @Input() task: any;
  @Output() updateTaskList = new EventEmitter();
  @Input() dueDate: any;
  @Input() userList: [];

  nextDate: any;
  totalEstimatedTime: number;
  nextDateModalForm: FormGroup;
  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  constructor(private fb: FormBuilder, private taskService: TaskService, public router: Router, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.maxLength(2), Validators.required]],
      newEstimatedMin: ['', [Validators.maxLength(2), Validators.required]],
      newDueDate: ['', [Validators.required, this.validateNewDueDate.bind(this)]],
      assignee: ['', [Validators.required]],
    });
  }

  validateNewDueDate(control: AbstractControl) {
    let currentDate = new Date();
    let selectedDate = new Date(control.value);
    currentDate.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    let taskDate;
    if (this.task) {
      taskDate = new Date(this.task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
    }
    if (this.task && taskDate.getFullYear() == 1970) {
      if (selectedDate.getTime() < currentDate.getTime()) {
        return { invalidDueDate: true }
      } else {
        return null;
      }
    }
    else if (this.task && taskDate.getTime() == (currentDate.getTime() - 86400000)) {
      if (selectedDate.getTime() <= (currentDate.getTime() - 86400000)) {
        return { invalidDueDate: true }
      } else {
        return null;
      }
    }
    else if (this.task && taskDate.getTime() > currentDate.getTime()) {
      if (selectedDate.getTime() <= taskDate.getTime()) {
        return { invalidDueDate: true }
      } else {
        return null;
      }
    }
    else if (selectedDate.getTime() <= currentDate.getTime()) {
      return { invalidDueDate: true };
    }
  }

  cancelTask() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.nextDateModalForm.reset();
    this.totalEstimatedTime = null;
  }

  selectAssignee(value) {
    if (value == '') {
      this.nextDateModalForm.get('newDueDate').reset()
    }
  }

  getnewDueDate(val) {
    if (val) {
      this.nextDate = new Date(val);
      this.nextDate.setHours(0, 0, 0, 0);
      this.getSelectedDayTask();
    }
  }


  getSelectedDayTask() {
    if (this.nextDate) {
      let dueDate = this.nextDate.getFullYear() + '-' + (this.nextDate.getMonth() + 1) + '-' + this.nextDate.getDate();
      this.taskService.getSelectedDateTask(this.nextDateModalForm.get('assignee').value, dueDate).subscribe((res: any) => {
        this.totalEstimatedTime = res.data;
        let totalTime = 480 - this.totalEstimatedTime;
        let divdeHour = totalTime / 60;
        let hours = Math.floor(divdeHour);
        let divmin = (divdeHour - hours) * 60;
        let minutes = Math.round(divmin);
        this.nextDateModalForm.get('newEstimatedHour').setValue(0);
        this.nextDateModalForm.get('newEstimatedMin').setValue(0);
        this.nextDateModalForm.get('newEstimatedHour').setValidators([Validators.max(hours)])
        this.nextDateModalForm.get('newEstimatedMin').setValidators([Validators.max(minutes)])
      })
    }
  }

  moveTask() {
    let newEstimatedHour = this.nextDateModalForm.get('newEstimatedHour').value;
    let newEstimatedMin = this.nextDateModalForm.get('newEstimatedMin').value;
    let totalEstimatedTime = (newEstimatedHour * 60) + newEstimatedMin;

    if (this.nextDate) {
      let newDueDate = (new Date(this.nextDate).getMonth() + 1) + '/' + (new Date(this.nextDate).getDate()) + '/' + (new Date(this.nextDate).getFullYear());
      let currentDate = new Date();
      let taskDate = new Date(this.task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      if (taskDate.getFullYear() == 1970) {
        this.nextDate.setHours(this.nextDate.getHours() + 5, 30)
        this.taskService.editTask({
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
      else if (taskDate.getTime() == currentDate.getTime()) {
        this.taskService.addTask({
          title: this.task.title, description: this.task.description,
          dueDate: this.nextDate, priority: this.task.priority, status: this.task.status,
          estimatedTime: totalEstimatedTime, originalTime: this.task.originalTime, clientTime: this.task.clientTime,
          assignee: this.nextDateModalForm.get('assignee').value,
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
        })
        this.taskService.editTask({
          taskId: this.task.taskId, clonned: 1, dueDate: this.task.dueDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
          this.updateTaskList.emit()
          this.cancelTask()
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
      else if (taskDate.getTime() == (currentDate.getTime() - 86400000)) {
        this.nextDate.setHours(this.nextDate.getHours() + 5, 30)
        this.taskService.editTask({
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
      else if (taskDate.getTime() > currentDate.getTime()) {
        this.nextDate.setHours(this.nextDate.getHours() + 5, 30)
        this.taskService.editTask({
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
    }
  }

  // Dont Delete
  // moveToNextDate() {
  //   if (this.router.url == '/employee/backlog' && this.dueDate != null) {
  //     let addnextDate = (new Date(this.dueDate).getMonth() + 1) + '/' +
  //       (new Date(this.dueDate).getDate() + 1) + '/' + (new Date(this.dueDate).getFullYear());
  //     console.log(new Date(addnextDate).setDate(new Date(addnextDate).getDate() + 1))
  //     this.nextDateModalForm.get('newDueDate').setValue(new Date(new Date(addnextDate).setDate(new Date(addnextDate).getDate() + 1)));
  //     this.nextDate = new Date(addnextDate);
  //     this.getnewDueDate(addnextDate);
  //   }
  //   else {
  //     let date = new Date(this.task.dueDate)
  //     date.setDate(date.getDate() + 2)
  //     console.log((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear()))
  //     let addnextDate = ((date.getDate()) + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear()));
  //     console.log(addnextDate)
  //     this.nextDateModalForm.get('newDueDate').setValue(addnextDate);
  //     this.nextDate = new Date(addnextDate);
  //     this.nextDate.setDate(this.nextDate.getDate() - 1)
  //     this.getnewDueDate(this.nextDate);
  //   }
  // }

}
