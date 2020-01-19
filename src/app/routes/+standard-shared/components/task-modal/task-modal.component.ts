import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../../services/task.service';
const swal = require('sweetalert');

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.scss']
})

export class TaskModalComponent implements OnInit, OnChanges {
  taskForm: FormGroup

  taskDate: any;
  taskDeatils: any;
  taskId: number;
  // userList: any[] = [];
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

  @Input() userId: any;
  @Input() userList: any;
  @Input() dueDate: any;
  //@Output() showTask = new EventEmitter();
  @Output() updateTaskList = new EventEmitter();
  @Input() task: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.task)
    this.ngOnInit();
    this.taskDate = this.dueDate;

    // if (!this.editBtn && this.taskForm) {
    //   this.taskForm.enable();
    //   this.taskForm.get('priority').setValue("normal");
    //   this.taskForm.get('status').setValue("planned");
    // }

    this.updateTask();
    //this.validateEstimateTime();
    this.ref.detectChanges();
  }

  constructor(private ref: ChangeDetectorRef, private fb: FormBuilder, private taskService: TaskService) { }

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

  }

  getUserList() {
    if (this.taskForm) {
      this.taskForm.get('assignee').setValue(this.userId);
    }
  }

  addTask() {
    let addDueDate = new Date(this.dueDate)
    addDueDate.setHours(0, 0, 0)
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
        this.updateTaskList.emit(this.taskForm.value);
        document.getElementById("cancel").click();
        // var x = document.getElementById("day-detail");
        // setTimeout(() => { x.classList.add("show") }, 350);
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
        // this.updateTaskList.emit(this.);
        document.getElementById("cancel").click();
        this.taskForm.reset();
        this.showCommentSecton = false;
      })
    }
  }

  updateTask() {
    let currentDate: Date = new Date();
    let convertedDate: Date;
    this.taskDeatils = this.task;
    if (this.task) {
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
        this.taskForm.enable();
        this.taskForm.get('title').reset();
        this.taskForm.get('title').setValidators([Validators.required])
        this.taskForm.get('description').reset();
        this.taskForm.get('estimatedHour').reset();
        this.taskForm.get('estimatedMin').reset();
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

  enableTask() {
    this.showTextButton = true;
    this.showModalFooter = true;
    this.buttonText = "Save";
    this.taskForm.enable();
    if (this.taskForm.get('status').value == 'planned' || this.taskForm.get('status').value == 'progress') {
      // this.buttonText = "Save";
      this.taskForm.get('clientHour').disable();
      this.taskForm.get('clientMin').disable();
      this.taskForm.get('originalHour').disable();
      this.taskForm.get('originalMin').disable();
    }
    // if (value && this.taskForm.get('status').value == 'completed') {
    //   this.showModalFooter = true;
    // }
  }


  cancelTask() {
    var x = document.getElementById("testing")
    //setTimeout(() => { x.classList.add("modal-open") }, 120);
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

  // validateEstimateTime() {
  //   this.sumOfEstimatedTime = 0;
  //   this.taskList.forEach(task => {
  //     if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' + (new Date(task.dueDate).getFullYear())) == (new Date(this.taskDate).getDate() + '/' + (new Date(this.taskDate).getMonth() + 1) + '/' + (new Date(this.taskDate).getFullYear()))) {
  //       this.sumOfEstimatedTime += task.estimatedTime
  //     }
  //   })
  //   if (this.sumOfEstimatedTime == 480) {
  //     this.taskForm.disable();
  //   }
  //   if (this.sumOfEstimatedTime == 0 && this.taskForm) {
  //     console.log("addnew")
  //     this.taskForm.get('estimatedHour').setValidators([Validators.max(8), Validators.required, Validators.maxLength(2)]);
  //     this.taskForm.get('estimatedMin').setValidators([Validators.max(59), Validators.required, Validators.maxLength(2)]);
  //   }
  //   if (this.sumOfEstimatedTime <= 480 && this.sumOfEstimatedTime != 0 && this.taskTitle == 'Add Task' && this.taskForm) {
  //     console.log("add")
  //     let hours = Math.floor(this.sumOfEstimatedTime / 60);
  //     let minutes = Math.floor(this.sumOfEstimatedTime - hours * 60);
  //     console.log(hours, minutes)
  //     this.taskForm.get('estimatedHour').setValidators([Validators.max(7 - hours), Validators.required, Validators.maxLength(2)]);
  //     this.taskForm.get('estimatedMin').setValidators([Validators.max(60 - minutes), Validators.required, Validators.maxLength(2)]);
  //     // if (minutes == 0) {
  //     //   // this.taskForm.get('estimatedHour').setValidators([Validators.max(8 - hours), Validators.required, Validators.maxLength(2)]);
  //     //   this.taskForm.get('estimatedMin').setValidators([Validators.max(60 - minutes), Validators.required, Validators.maxLength(2)]);
  //     // }
  //     // // else if (minutes != 0 && hours == 7) {
  //     // //   this.taskForm.get('estimatedHour').setValidators([Validators.max(7 - hours), Validators.required, Validators.maxLength(2)]);
  //     // //   this.taskForm.get('estimatedMin').setValidators([Validators.max(60 - minutes), Validators.required, Validators.maxLength(2)]);
  //     // // }
  //     // else {
  //     //   // this.taskForm.get('estimatedHour').setValidators([Validators.max(7 - hours), Validators.required, Validators.maxLength(2)]);

  //     // }
  //   }
  //   else if (this.sumOfEstimatedTime <= 480 && this.sumOfEstimatedTime != 0 && this.taskTitle != 'Add Task' && this.taskForm) {
  //     console.log("edit")
  //     let editSum = 480 - this.sumOfEstimatedTime
  //     // editSum = editSum + this.taskDeatils.estimatedTime;
  //     console.log(editSum, this.taskDeatils.estimatedTime)
  //     let editHour = Math.floor(editSum / 60);
  //     let editMinute = Math.floor(editSum - editHour * 60);
  //     console.log(editMinute, editHour, this.taskForm.get('estimatedMin').value)
  //     let m1 = (59 - (this.taskForm.get('estimatedMin').value - editMinute));
  //     console.log(m1)
  //     this.taskForm.get('estimatedHour').setValidators([Validators.max(this.taskForm.get('estimatedHour').value + editHour), Validators.maxLength(2)]);
  //     this.taskForm.get('estimatedMin').setValidators([Validators.max(this.taskForm.get('estimatedMin').value + editMinute), Validators.maxLength(2)]);
  //   }
  // }

  validateEstimateHour(hour) {

    if (hour == 8) {
      this.taskForm.get('estimatedMin').setValue(0);
      this.taskForm.get('estimatedMin').disable();
    } else {
      this.taskForm.get('estimatedMin').enable();
    }
    // if (this.sumOfEstimatedTime == 0 && this.taskForm) {
    //   console.log("addnew")
    //   this.taskForm.get('estimatedHour').setValidators([Validators.max(8), Validators.required, Validators.maxLength(2)]);
    //   this.taskForm.get('estimatedMin').setValidators([Validators.max(59), Validators.required, Validators.maxLength(2)]);
    // }
    // if (this.sumOfEstimatedTime <= 480 && this.sumOfEstimatedTime != 0 && this.taskTitle == 'Add Task' && this.taskForm) {
    //   console.log("add")
    //   let hours = Math.floor(this.sumOfEstimatedTime / 60);
    //   let minutes = Math.floor(this.sumOfEstimatedTime - hours * 60);
    //   this.taskForm.get('estimatedHour').setValidators([Validators.max(7 - hours), Validators.required, Validators.maxLength(2)]);
    //   this.taskForm.get('estimatedMin').setValidators([Validators.max(60 - minutes), Validators.required, Validators.maxLength(2)]);
    // }
    // else if (this.sumOfEstimatedTime <= 480 && this.sumOfEstimatedTime != 0 && this.taskTitle != 'Add Task' && this.taskForm) {
    //   console.log("edit")
    //   let editSum = 480 - this.sumOfEstimatedTime
    //   // editSum = editSum + this.taskDeatils.estimatedTime;
    //   console.log(editSum, this.taskDeatils.estimatedTime)
    //   let editHour = Math.floor(editSum / 60);
    //   let editMinute = Math.floor(editSum - editHour * 60);
    //   console.log(editMinute, editHour, this.taskForm.get('estimatedMin').value)
    //   let m1 = (59 - (this.taskForm.get('estimatedMin').value - editMinute));
    //   console.log(m1)
    //   this.taskForm.get('estimatedHour').setValidators([Validators.max(this.taskForm.get('estimatedHour').value + editHour), Validators.maxLength(2)]);
    //   this.taskForm.get('estimatedMin').setValidators([Validators.max(this.taskForm.get('estimatedMin').value + editMinute), Validators.maxLength(2)]);
    // }
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
      this.updateTaskList.emit();
    });
  }

}
