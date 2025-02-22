import { Component, EventEmitter, Input, OnInit, Output, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { LeaveRequestService } from '../../../../services/leave-request.service';
declare var swal: any;

@Component({
  selector: 'app-move-to-next-date-modal',
  templateUrl: './move-to-next-date-modal.component.html',
  styleUrls: ['./move-to-next-date-modal.component.scss']
})

export class MoveToNextDateModalComponent implements OnInit, OnChanges {

  @Input() task: any;
  @Output() updateTaskList = new EventEmitter();
  @Input() dueDate: any;
  @Input() userList: [];
  @Input() validateTask: string;

  nextDate: any;
  totalEstimatedTime: number;
  nextDateModalForm: FormGroup;
  showHoliday: boolean
  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  constructor(private fb: FormBuilder, private taskService: TaskService, public router: Router,
    private ref: ChangeDetectorRef, private leaveRequest: LeaveRequestService) { }

  ngOnInit() {
    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.maxLength(2), Validators.required, this.validateEstimatedHour.bind(this)]],
      newEstimatedMin: ['', [Validators.maxLength(2), Validators.required, this.validateEstimatedMin.bind(this)]],
      newDueDate: ['', [Validators.required, this.validateNewDueDate.bind(this)]],
      assignee: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.task && this.nextDateModalForm) {
      this.nextDateModalForm.get('assignee').setValue(this.task.userId)
      this.ref.detectChanges();;
    }
  }

  validateEstimatedHour(control: AbstractControl) {
    if (this.nextDateModalForm) {
      if ((this.nextDateModalForm.get('newEstimatedMin').value + (control.value * 60)) > (480 - this.totalEstimatedTime)) {
        return { invalidEstimateHour: true };
      } else {
        return null;
      }
    }
  }

  validateEstimatedMin(control: AbstractControl) {
    if (this.nextDateModalForm) {
      if (((this.nextDateModalForm.get('newEstimatedHour').value * 60) + control.value) > (480 - this.totalEstimatedTime)) {
        return { invalidEstimateMin: true };
      } else {
        return null;
      }
    }
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
    if (this.validateTask != 'backlog') {
      var x = document.getElementById("testing")
      setTimeout(() => { x.classList.add("modal-open") }, 150);
    }
    this.nextDateModalForm.reset();
    this.totalEstimatedTime = null;
  }

  selectAssignee(value) {
    if (value == '') {
      this.nextDateModalForm.get('newDueDate').reset()
    }
  }

  getNewDueDate(val) {
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
        this.totalEstimatedTime = res.data.totalEstimatedTime;
        if (res.data.isHoliday != null) {
          this.showHoliday = true;
        }
        else {
          this.showHoliday = false;
        }
        this.nextDateModalForm.get('newEstimatedHour').setValue(0);
        this.nextDateModalForm.get('newEstimatedMin').setValue(0);
      })
    }
  }

  // getSelectedDayLeave() {
  //   this.leaveRequest.getApprovedLeaveData({ firstDay: '2020-02-01', lastDay: '2020-02-29' }).subscribe((res: any) => {
  //     console.log(res)
  //     res.data.forEach(leave => {
  //       if (new Date(this.nextDate).getDate() + '/' + (new Date(this.nextDate).getMonth() + 1) + '/' + new Date(this.nextDate).getFullYear() ==
  //         new Date(leave.fromDate).getDate() + '/' + (new Date(leave.fromDate).getMonth() + 1) + '/' + new Date(leave.fromDate).getFullYear()) {
  //         if (new Date(this.nextDate).getDate() + '/' + (new Date(this.nextDate).getMonth() + 1) + '/' + new Date(this.nextDate).getFullYear() <=
  //           new Date(leave.toDate).getDate() + '/' + (new Date(leave.toDate).getMonth() + 1) + '/' + new Date(leave.toDate).getFullYear())
  //           console.log("test")
  //       }
  //     })
  //   })
  // }

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
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value,
          estimatedTime: totalEstimatedTime, action: 'Moved to' + new Date(this.nextDate).toLocaleDateString()
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
      else if (taskDate.getTime() <= currentDate.getTime()) {
        this.taskService.addTask({
          title: this.task.title, description: this.task.description,
          dueDate: this.nextDate, priority: this.task.priority, status: this.task.status,
          estimatedTime: totalEstimatedTime, originalTime: this.task.originalTime, clientTime: this.task.clientTime,
          assignee: this.nextDateModalForm.get('assignee').value, action: 'Clonned to ' + new Date(this.nextDate).toLocaleDateString()
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
        })
        this.taskService.editTask({
          taskId: this.task.taskId, clonned: 1, dueDate: this.task.dueDate, estimatedTime: 0,
          assignee: this.nextDateModalForm.get('assignee').value,
        }).subscribe((res: any) => {
          this.updateTaskList.emit()
          this.cancelTask()
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
      else if (taskDate.getTime() > currentDate.getTime()) {
        this.nextDate.setHours(this.nextDate.getHours() + 5, 30)
        this.taskService.editTask({
          taskId: this.task.taskId, dueDate: this.nextDate, assignee: this.nextDateModalForm.get('assignee').value,
          estimatedTime: totalEstimatedTime, action: 'Moved to ' + new Date(this.nextDate).toLocaleDateString()
        }).subscribe((res: any) => {
          this.updateTaskList.emit();
          this.cancelTask();
          swal('Success', 'Task(TMS-' + this.task.taskId + ') has been moved to ' + newDueDate, 'success');
        });
      }
    }
  }

  moveToNextDate() {
    if (this.validateTask == 'backlog' && this.dueDate != null) {
      let date = new Date(this.dueDate);
      date.setDate(date.getDate() + 1);
      console.log(date.getDate() + '/' + (date.getMonth() + 1) + '/' + (date.getFullYear()))
      this.nextDateModalForm.get('newDueDate').setValue(date);
      this.getNewDueDate(date);
    }
    else {
      let taskDate = new Date(this.task.dueDate)
      taskDate.setDate(taskDate.getDate() + 1);
      this.nextDateModalForm.get('newDueDate').setValue(taskDate);
      this.getNewDueDate(taskDate);
    }
  }

}
