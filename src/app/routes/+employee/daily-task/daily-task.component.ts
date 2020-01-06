import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { LoginService } from '../../../services';
const swal = require('sweetalert');

@Component({
  selector: 'app-daily-task',
  templateUrl: './daily-task.component.html',
  styleUrls: ['./daily-task.component.scss']
})

export class DailyTaskComponent implements OnInit, OnChanges {
  taskForm: FormGroup
  commentForm: FormGroup
  taskDate: any;
  taskDeatils: any;
  taskId: number;
  userList: any[] = [];
  commentList: any[] = [];
  buttonText: any;
  taskTitle: any;
  totalEstimatedMin: any;
  totalClientMin: any;
  totalOriginalTime: any;
  showTaskUpdated: boolean;
  showCommentSecton: boolean;
  showCommentButton: boolean;
  showTextButton: boolean = true;
  sumOfEstimatedTime: number;
  showModalFooter: boolean = true;

  @Input() showDate: any;
  @Output() showTask = new EventEmitter();
  @Input() editTask: any;
  @Input() editBtn: boolean;
  @Input() allTasksList: any;

  ngOnChanges(): void {
    this.taskDate = this.showDate;
    if (!this.editBtn && this.taskForm) {
      this.taskForm.get('priority').setValue("normal");
      this.taskForm.get('status').setValue("planned");
      this.taskForm.get('estimatedMin').setValidators([Validators.maxLength(2), Validators.max(8)])
      this.taskForm.get('estimatedHour').setValidators([Validators.maxLength(2), Validators.max(59)])
    }
    this.getUserList();
    this.updateTask();
    this.validateEstimateTime();
    this.ref.detectChanges();
  }

  constructor(private ref: ChangeDetectorRef, private fb: FormBuilder, private taskService: TaskService,
    private userService: SuperAdminService, private loginService: LoginService) { }

  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.maxLength(5000)]],
      dueDate: [''],
      priority: [''],
      status: [''],
      assignee: [''],
      estimatedHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      estimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      clientHour: ['', [Validators.required, Validators.maxLength(2)]],
      clientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      originalHour: ['', [Validators.required, Validators.maxLength(2)]],
      originalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
    });

    this.commentForm = this.fb.group({
      'comment': ['', [Validators.maxLength(5000)]]
    })
  }

  getUserList() {
    const User: any = this.loginService.currentUser;
    this.userService.getUserList().subscribe(
      (res: any) => {
        this.userList = res.data;
      })
    if (this.taskForm) {
      this.taskForm.get('assignee').setValue(User.id)
    }
  }

  addTask() {
    let addDueDate = new Date(this.showDate)
    addDueDate.setHours(addDueDate.getHours() + 5, 30);
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
        dueDate: addDueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: this.totalEstimatedMin, originalTime: this.totalOriginalTime, clientTime: this.totalClientMin,
        assignee: this.taskForm.get('assignee').value, taskId: this.taskId
      }).subscribe((res: any) => {
        swal('Success', 'Task(#' + this.taskId + ') is edited :)', 'success');
        this.showTask.emit();
        document.getElementById("cancel").click();
        var x = document.getElementById("day-detail");
        setTimeout(() => { x.classList.add("show") }, 350);
      })
    }
    else {
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
      this.taskService.addTask({
        title: this.taskForm.get('title').value, description: this.taskForm.get('description').value,
        dueDate: addDueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: this.totalEstimatedMin, originalTime: this.totalOriginalTime, clientTime: this.totalClientMin,
        assignee: this.taskForm.get('assignee').value
      }).subscribe((res: any) => {
        swal('Success', 'Task is added :)', 'success');
        this.showTask.emit();
        document.getElementById("cancel").click();
        this.taskForm.reset();
        this.showCommentSecton = false;
      })
    }
  }

  updateTask() {
    this.validateEstimateTime();
    let currentDate: Date = new Date();
    let convertedDate: Date;
    this.taskDeatils = this.editTask;
    if (this.editTask && this.editBtn) {
      this.showTaskUpdated = true;
      this.showCommentButton = true;
      this.showTextButton = false;
      if (this.taskDeatils.comments && this.taskDeatils.comments.length != 0) {
        this.showCommentSecton = true;
      }
      // To control previous day task
      currentDate.setDate(currentDate.getDate() - 1);
      convertedDate = new Date(currentDate);
      let duedate = new Date(this.taskDeatils.dueDate);
      let compareConvertedDate = convertedDate.getDate()
      let compareDueDate = duedate.getDate()
      if (compareDueDate < compareConvertedDate) {
        this.showModalFooter = false;
        this.taskForm.disable();
      }
      else {
        this.showModalFooter = true;
      }
      this.taskTitle = 'Edit Task' + '\t' + '(#' + this.taskDeatils.taskId + ')';
      this.taskForm.disable();
      let estimatedGetTime = this.taskDeatils.estimatedTime;
      let convEstimatedHours = Math.floor(estimatedGetTime / 60);
      let convEstimatedmin = estimatedGetTime % 60;
      let clientGetTime = this.taskDeatils.clientTime;
      let convclientHours = Math.floor(clientGetTime / 60);
      let convclientMin = clientGetTime % 60;
      let originalGetTime = this.taskDeatils.originalTime;
      let convOriginalHours = Math.floor(originalGetTime / 60);
      let convOriginalMin = originalGetTime % 60;
      this.taskId = this.taskDeatils.taskId;
      this.taskForm.get('title').setValue(this.taskDeatils.title);
      this.taskForm.get('description').setValue(this.taskDeatils.description)
      this.taskForm.get('priority').setValue(this.taskDeatils.priority)
      this.taskForm.get('assignee').setValue(this.taskDeatils.userId)
      this.taskForm.get('status').setValue(this.taskDeatils.status)
      this.taskForm.get('estimatedHour').setValue(convEstimatedHours)
      this.taskForm.get('estimatedMin').setValue(convEstimatedmin)
      this.taskForm.get('clientHour').setValue(convclientHours)
      this.taskForm.get('clientMin').setValue(convclientMin)
      this.taskForm.get('originalHour').setValue(convOriginalHours)
      this.taskForm.get('originalMin').setValue(convOriginalMin)
      this.commentList = this.taskDeatils.comments;
    }
    else {
      this.taskTitle = 'Add Task'
      this.buttonText = "Submit";
      this.showTextButton = true;
      this.showTaskUpdated = false;
      this.showCommentButton = false;
      this.showCommentSecton = false;
      if (this.taskForm) {
        this.taskForm.get('title').reset();
        this.taskForm.get('title').setValidators([Validators.required])
        this.taskForm.get('description').reset();
        this.taskForm.get('estimatedHour').reset();
        this.taskForm.get('estimatedMin').reset();
        this.taskForm.enable();
        this.taskForm.get('clientHour').reset();
        this.taskForm.get('clientMin').reset();
        this.taskForm.get('originalHour').reset();
        this.taskForm.get('originalMin').reset();
        this.taskForm.get('clientHour').disable();
        this.taskForm.get('clientMin').disable();
        this.taskForm.get('originalHour').disable();
        this.taskForm.get('originalMin').disable();
      }
    }
  }

  enableTask(value) {
    this.showTextButton = true;
    if (value && this.taskForm.get('status').value == 'planned' || this.taskForm.get('status').value == 'progress') {
      this.showModalFooter = true;
      this.buttonText = "Save";
      this.taskForm.enable();
      this.taskForm.get('clientHour').disable();
      this.taskForm.get('clientMin').disable();
      this.taskForm.get('originalHour').disable();
      this.taskForm.get('originalMin').disable();
    }
    if (value && this.taskForm.get('status').value == 'completed') {
      this.showModalFooter = true;
      this.buttonText = "Save";
      this.taskForm.enable();
    }
  }

  addComment() {
    this.taskService.addComment({ comment: this.commentForm.get('comment').value, taskId: this.taskId }).subscribe((res: any) => {
      this.editBtn = true
      this.cancelComment();
      this.showTask.emit();
    })
    this.commentForm.reset();
  }

  cancelComment() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 330);
  }

  cancelTask() {
    console.log("adsada")
    var x = document.getElementById("testing")
    setTimeout(() => { x.classList.add("modal-open") }, 350);

    // var x = document.getElementById("day-detail")
    // setTimeout(() => { x.classList.add("show") }, 350);
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

  validateEstimateTime() {
    this.sumOfEstimatedTime = 0;
    this.allTasksList.forEach(task => {
      if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' + (new Date(task.dueDate).getFullYear())) == (new Date(this.taskDate).getDate() + '/' + (new Date(this.taskDate).getMonth() + 1) + '/' + (new Date(this.taskDate).getFullYear()))) {
        this.sumOfEstimatedTime += task.estimatedTime
      }
    })
    if (this.sumOfEstimatedTime == 480) {
      // this.showModalFooter = false;
      this.taskForm.disable();
    }
    else if (this.sumOfEstimatedTime < 480 && this.sumOfEstimatedTime != 0 && !this.editBtn) {
      // console.log("sdasdd")
      // this.showModalFooter = true;
      let hours = Math.floor(this.sumOfEstimatedTime / 60);
      let minutes = Math.floor(this.sumOfEstimatedTime - hours * 60);
      this.taskForm.get('estimatedHour').setValidators([Validators.max(7 - hours), Validators.required, Validators.maxLength(2)]);
      this.taskForm.get('estimatedMin').setValidators([Validators.max(60 - minutes), Validators.required, Validators.maxLength(2)]);
    }
    else if (this.sumOfEstimatedTime < 480 && this.sumOfEstimatedTime != 0 && this.editBtn) {
      // console.log("qweq")
      // this.showModalFooter = true;
      let editSum = 480 - this.sumOfEstimatedTime
      let editHour = Math.floor(editSum / 60);
      let editMinute = Math.floor(editSum - editHour * 60);
      console.log(editMinute, editHour, this.taskForm.get('estimatedMin').value)
      let m1 = (59 - (this.taskForm.get('estimatedMin').value - editMinute));
      console.log(m1)
      this.taskForm.get('estimatedHour').setValidators([Validators.max(this.taskForm.get('estimatedHour').value + editHour), Validators.maxLength(2)]);
      this.taskForm.get('estimatedMin').setValidators([Validators.max(this.taskForm.get('estimatedMin').value + editMinute), Validators.maxLength(2)]);
    }
  }

  validateEstimateHour(hour) {
    if (hour == 8) {
      this.taskForm.get('estimatedMin').setValue('00');
      this.taskForm.get('estimatedMin').disable();
    } else {
      this.taskForm.get('estimatedMin').enable();
    }
  }

  validateEstimateMin(min) {
    if (min == '60') {
      this.taskForm.get('estimatedHour').setValue(this.taskForm.get('estimatedHour').value + 1);
      this.taskForm.get('estimatedMin').setValue('00');
    }
  }

  deleteTaskSwal() {
    swal({
      title: "Are you sure?",
      text: "Task(#" + this.taskId + ") will be deleted from database!",
      icon: "warning",
      buttons: true,
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
      this.showTask.emit();
    });
  }

}
