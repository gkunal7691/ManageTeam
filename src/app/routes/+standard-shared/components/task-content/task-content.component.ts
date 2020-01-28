import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
declare var swal: any;

@Component({
  selector: 'app-task-content',
  templateUrl: './task-content.component.html',
  styleUrls: ['./task-content.component.scss']
})
export class TaskContentComponent implements OnInit {

  @Input() userId: any;
  @Input() userList: any;
  @Input() dueDate: any;
  @Output() updateTaskList = new EventEmitter();
  @Input() task: any;
  @Input() totalEstimatedTime: number;

  taskForm: FormGroup

  totalEstimatedMin: number;
  totalClientMin: number;
  totalOriginalTime: number;
  taskId: number;

  buttonText: any;
  taskTitle: any;

  showTaskUpdated: boolean;
  showCommentSecton: boolean;
  showCommentButton: boolean;
  showTextButton: boolean = true;
  showModalFooter: boolean = true;

  constructor(private fb: FormBuilder,
    private taskService: TaskService, private router: Router) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.maxLength(5000)]],
      dueDate: [''],
      priority: [''],
      status: [''],
      assignee: [''],
      estimatedHour: ['', [Validators.required, Validators.maxLength(1), Validators.max(8), this.validateEstimatedHour.bind(this)]],
      estimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59), this.validateEstimatedMin.bind(this)]],
      clientHour: ['', [Validators.required, Validators.maxLength(1)]],
      clientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      originalHour: ['', [Validators.required, Validators.maxLength(1)]],
      originalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
    });
  }

  validateEstimatedHour(control: AbstractControl) {
    if (this.taskForm) {
      if (this.router.url == '/employee/backlog') {
        this.taskForm.get('estimatedHour').setValidators(null)
      }
      if ((this.taskForm.get('estimatedMin').value + (control.value * 60)) > (480 - this.totalEstimatedTime)) {
        return { estimateHour: true };
      } else {
        return null;
      }
    }
  }

  validateEstimatedMin(control: AbstractControl) {
    if (this.taskForm) {
      if (this.router.url == '/employee/backlog') {
        this.taskForm.get('estimatedMin').setValidators(null)
      }
      if (((this.taskForm.get('estimatedHour').value * 60) + control.value) > (480 - this.totalEstimatedTime)) {
        return { estimateMin: true };
      } else {
        return null;
      }
    }
  }

  cancelTask() {
    if ('/employee/month-view' == this.router.url) {
      var x = document.getElementById("testing")
      setTimeout(() => { x.classList.add("modal-open") }, 150);
    }
    else if ('/admin/manage-time' == this.router.url) {
      var x = document.getElementById("testing")
      setTimeout(() => { x.classList.add("modal-open") }, 150);
    }
  }

  addTask() {
    let addDueDate = new Date(this.dueDate)
    addDueDate.setHours(0, 0, 0);
    if (this.showTaskUpdated == true) {
      let estimatedHour = this.taskForm.get('estimatedHour').value;
      let estimatedMin = this.taskForm.get('estimatedMin').value;
      if (estimatedMin == 60) {
        estimatedHour = estimatedHour + 1;
        estimatedMin = 0;
        this.totalEstimatedMin = (estimatedHour * 60) + estimatedMin;
      }
      this.totalEstimatedMin = (estimatedHour * 60) + estimatedMin;

      let clientHour = this.taskForm.get('clientHour').value;
      let clientdMin = this.taskForm.get('clientMin').value;
      this.totalClientMin = (clientHour * 60) + clientdMin;

      let orignialHour = this.taskForm.get('originalHour').value;
      let orignalMin = this.taskForm.get('originalMin').value;
      this.totalOriginalTime = (orignialHour * 60) + orignalMin;
      this.taskService.editTask({
        title: this.taskForm.get('title').value, description: this.taskForm.get('description').value,
        dueDate: this.task.dueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: this.totalEstimatedMin, originalTime: this.totalOriginalTime, clientTime: this.totalClientMin,
        assignee: this.taskForm.get('assignee').value, taskId: this.taskId
      }).subscribe((res: any) => {
        swal('Success', 'Task(#' + this.taskId + ') is edited :)', 'success');
        this.updateTaskList.emit(this.taskForm.value);
        document.getElementById("cancel").click();
      })
    }
    else {
      let estimatedHour = this.taskForm.get('estimatedHour').value;
      let estimatedMin = this.taskForm.get('estimatedMin').value;
      this.totalEstimatedMin = (estimatedHour * 60) + estimatedMin;
      let clientHour = this.taskForm.get('clientHour').value;
      let clientdMin = this.taskForm.get('clientMin').value;
      this.totalClientMin = (clientHour * 60) + clientdMin;
      let orignialHour = this.taskForm.get('originalHour').value;
      let orignalMin = this.taskForm.get('originalMin').value;
      this.totalOriginalTime = (orignialHour * 60) + orignalMin;
      this.taskService.addTask({
        title: this.taskForm.get('title').value, description: this.taskForm.get('description').value,
        dueDate: addDueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: this.totalEstimatedMin, originalTime: this.totalOriginalTime, clientTime: this.totalClientMin,
        assignee: this.taskForm.get('assignee').value
      }).subscribe((res: any) => {
        if (res.data != "Error Cant Add") {
          swal('Success', 'Task is added :)', 'success');
        }
        else {
          swal('Warning', 'Task cannot be added :)', 'error')
        }
        this.updateTaskList.emit(this.taskForm.value);
        document.getElementById("cancel").click();
        this.taskForm.reset();
        this.showCommentSecton = false;
      })
    }
  }


  updateTask(task) {
    console.log(task)
    this.task = task;
    // To control previous day task
    let currentDate: Date = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    let duedate = new Date(this.dueDate);
    if (duedate < currentDate && this.router.url != '/employee/backlog') {
      this.showModalFooter = false;
      this.taskForm.disable();
    }
    else {
      this.showModalFooter = true;
    }
    if (this.task) {
      this.showTaskUpdated = true;
      this.showCommentButton = true;
      this.showTextButton = false;
      if (this.task.comments && this.task.comments.length != 0) {
        this.showCommentSecton = true;
      }
      this.taskTitle = 'Edit Task' + '\t' + '(#' + this.task.taskId + ')';
      this.taskForm.disable();
      let estimatedGetTime = this.task.estimatedTime;
      let convEstimatedHours = Math.floor(estimatedGetTime / 60);
      let convEstimatedmin = estimatedGetTime % 60;
      let clientGetTime = this.task.clientTime;
      let convclientHours = Math.floor(clientGetTime / 60);
      let convclientMin = clientGetTime % 60;
      let originalGetTime = this.task.originalTime;
      let convOriginalHours = Math.floor(originalGetTime / 60);
      let convOriginalMin = originalGetTime % 60;
      this.taskId = this.task.taskId;
      this.taskForm.get('title').setValue(this.task.title);
      this.taskForm.get('description').setValue(this.task.description);
      this.taskForm.get('priority').setValue(this.task.priority);
      this.taskForm.get('assignee').setValue(this.task.userId);
      this.taskForm.get('status').setValue(this.task.status);
      this.taskForm.get('estimatedHour').setValue(convEstimatedHours);
      this.taskForm.get('estimatedMin').setValue(convEstimatedmin);
      this.taskForm.get('clientHour').setValue(convclientHours);
      this.taskForm.get('clientMin').setValue(convclientMin);
      this.taskForm.get('originalHour').setValue(convOriginalHours);
      this.taskForm.get('originalMin').setValue(convOriginalMin);
    }
    else {
      this.taskTitle = 'Add Task'
      this.buttonText = "Submit";
      this.showTextButton = true;
      this.showTaskUpdated = false;
      this.showCommentButton = false;
      this.showCommentSecton = false;
      if (this.taskForm) {
        this.taskForm.enable();
        this.taskForm.get('title').reset();
        this.taskForm.get('title').setValidators([Validators.required]);
        this.taskForm.get('description').reset();
        this.taskForm.get('estimatedHour').reset();
        this.taskForm.get('estimatedMin').reset();
        this.taskForm.get('clientHour').reset();
        this.taskForm.get('clientMin').reset();
        this.taskForm.get('originalHour').reset();
        this.taskForm.get('originalMin').reset();
        this.taskForm.get('assignee').setValue(this.userId);
        this.taskForm.get('priority').setValue("normal");
        this.taskForm.get('status').setValue("planned");
        this.taskForm.get('clientHour').disable();
        this.taskForm.get('clientMin').disable();
        this.taskForm.get('originalHour').disable();
        this.taskForm.get('originalMin').disable();
      }
    }
  }

  enableTask() {
    this.showTextButton = true;
    this.showModalFooter = true;
    this.buttonText = "Save";
    this.taskForm.enable();
    if (this.taskForm.get('status').value == 'planned' || this.taskForm.get('status').value == 'progress') {
      this.taskForm.get('clientHour').disable();
      this.taskForm.get('clientMin').disable();
      this.taskForm.get('originalHour').disable();
      this.taskForm.get('originalMin').disable();
    }
  }

  onStatusCompleted(value) {
    if (value == "completed") {
      this.taskForm.get('clientHour').enable();
      this.taskForm.get('clientMin').enable();
      this.taskForm.get('originalHour').enable();
      this.taskForm.get('originalMin').enable();
      this.taskForm.get('clientHour').setValidators([Validators.required]);
      this.taskForm.get('clientMin').setValidators([Validators.required]);
      this.taskForm.get('originalHour').setValidators([Validators.required]);
      this.taskForm.get('originalMin').setValidators([Validators.required]);
    }
    else if (value != "completed") {
      this.taskForm.get('clientHour').disable();
      this.taskForm.get('clientMin').disable();
      this.taskForm.get('originalHour').disable();
      this.taskForm.get('originalMin').disable();
      this.taskForm.get('clientHour').setValidators([Validators.required]);
      this.taskForm.get('clientMin').setValidators([Validators.required]);
      this.taskForm.get('originalHour').setValidators([Validators.required]);
      this.taskForm.get('originalMin').setValidators([Validators.required]);
    }
  }

  validateEstimateHour(hour) {
    if (hour == 8) {
      this.taskForm.get('estimatedMin').setValue(0);
      this.taskForm.get('estimatedMin').disable();
    } else {
      this.taskForm.get('estimatedMin').enable();
    }
  }

  validateEstimateMin(min) {
    if (min == '60') {
      this.taskForm.get('estimatedHour').setValue(this.taskForm.get('estimatedHour').value + 1);
      this.taskForm.get('estimatedMin').setValue(0);
    }
  }

  deleteTaskSwal() {
    swal({
      title: "Are you sure?",
      text: "Task(#" + this.taskId + ") will be deleted from database!",
      icon: "warning",
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        // document.getElementById("cancel").click();
        this.onDeleteTaskPopUp();
      } else {
        swal('Cancelled', 'Task(#' + this.taskId + ') is not deleted :)', 'error');
      }
    });
  }

  onDeleteTaskPopUp() {
    this.taskService.deleteTask(this.taskId).subscribe((res: any) => {
      swal('Deleted', 'Task(#' + this.taskId + ') has been removed :)', 'warning');
      this.updateTaskList.emit();
      document.getElementById("cancel").click();
    });
  }


}
