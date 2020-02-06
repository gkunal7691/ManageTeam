import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../services/task.service';
import { UserService } from '../../../../services/user.service';
import { LoginService } from '../../../../services/login.service';
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
  url: any;
  taskId: any;

  buttonText: any;
  taskTitle: any;

  modalWidthControl: boolean;
  isEdit: boolean;
  showCommentSecton: boolean;
  showCommentButton: boolean;
  showTextButton: boolean = true;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public taskService: TaskService, private userService: UserService, private loginService: LoginService) { }

  ngOnInit() {
    this.url = location;
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.maxLength(5000)]],
      dueDate: [''],
      priority: [''],
      status: [''],
      assignee: ['', [Validators.required, this.validateAssignee.bind(this)]],
      estimatedHour: ['', [Validators.required, Validators.maxLength(1), Validators.max(8), this.validateEstimatedHour.bind(this)]],
      estimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59), this.validateEstimatedMin.bind(this)]],
      clientHour: ['', [Validators.required, Validators.maxLength(1)]],
      clientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      originalHour: ['', [Validators.required, Validators.maxLength(1)]],
      originalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      isDoubt: ['']
    });
    if (!this.userList && !this.userId) {
      if (this.router.url != '/employee/backlog' && this.router.url != '/admin/backlog') {
        this.modalWidthControl = true;
      }
      else {
        this.modalWidthControl = false;
      }
      this.userService.getEmployees().subscribe((res: any) => {
        this.userList = res.data;
        this.userId = this.loginService.currentUser.id;
        this.getSingleTask(this.route.snapshot.paramMap.get('id'));
      })
    }
    else {
      this.modalWidthControl = false;
    }
  }

  getSingleTask(taskId) {
    this.taskService.getSingleTask(taskId).subscribe((res: any) => {
      this.task = res.data;
      if (this.task) {
        this.dueDate = new Date(this.task.dueDate);
        this.getEstimatedTime(this.task.userId, this.task.dueDate)
        this.updateTask(this.task);
      }
    })
  }

  getEstimatedTime(userId, taskDate) {
    let dueDate = new Date(taskDate).getFullYear() + '-' + (new Date(taskDate).getMonth() + 1) + '-' + new Date(taskDate).getDate();
    this.taskService.getSelectedDateTask(userId, dueDate).subscribe((res: any) => {
      this.totalEstimatedTime = res.data;
    })
  }

  validateAssignee(control: AbstractControl) {
    if (this.taskForm) {
      if (this.router.url == '/employee/backlog') {
        this.taskForm.get('assignee').setValidators(null)
      }
      else {
        return null;
      }
    }
  }

  validateEstimatedHour(control: AbstractControl) {
    if (this.taskForm) {
      if (this.router.url == '/employee/backlog') {
        this.taskForm.get('estimatedHour').setValidators(null)
      }
      if ((this.taskForm.get('estimatedMin').value + (control.value * 60)) > (480 - this.totalEstimatedTime)) {
        return { invalidEstimateHour: true };
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
        return { invalidEstimateMin: true };
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
    if (this.task) {
      this.totalEstimatedTime += this.task.estimatedTime;
    }
  }

  addTask() {
    let addDueDate = new Date(this.dueDate)
    addDueDate.setHours(0, 0, 0);
    let totalEstimatedMin: number;
    let totalClientMin: number;
    let totalOriginalTime: number;
    if (this.isEdit == true) {
      let estimatedHour = this.taskForm.get('estimatedHour').value;
      let estimatedMin = this.taskForm.get('estimatedMin').value;
      if (estimatedMin == 60) {
        estimatedHour = estimatedHour + 1;
        estimatedMin = 0;
        totalEstimatedMin = (estimatedHour * 60) + estimatedMin;
      }
      totalEstimatedMin = (estimatedHour * 60) + estimatedMin;

      let clientHour = this.taskForm.get('clientHour').value;
      let clientdMin = this.taskForm.get('clientMin').value;
      totalClientMin = (clientHour * 60) + clientdMin;

      let orignialHour = this.taskForm.get('originalHour').value;
      let orignalMin = this.taskForm.get('originalMin').value;
      totalOriginalTime = (orignialHour * 60) + orignalMin;
      this.taskService.editTask({
        title: this.taskForm.get('title').value, description: this.taskForm.get('description').value,
        dueDate: this.task.dueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: totalEstimatedMin, originalTime: totalOriginalTime, clientTime: totalClientMin,
        assignee: this.taskForm.get('assignee').value, taskId: this.task.taskId, isDoubt: this.taskForm.get('isDoubt').value,
        action: 'Updated'
      }).subscribe((res: any) => {
        swal('Success', 'Task(TMS-' + this.task.taskId + ') is edited :)', 'success');
        this.updateTaskList.emit(this.taskForm.value);
        document.getElementById("cancel").click();
      })
    }
    else {
      let estimatedHour = this.taskForm.get('estimatedHour').value;
      let estimatedMin = this.taskForm.get('estimatedMin').value;
      totalEstimatedMin = (estimatedHour * 60) + estimatedMin;
      let clientHour = this.taskForm.get('clientHour').value;
      let clientdMin = this.taskForm.get('clientMin').value;
      totalClientMin = (clientHour * 60) + clientdMin;
      let orignialHour = this.taskForm.get('originalHour').value;
      let orignalMin = this.taskForm.get('originalMin').value;
      totalOriginalTime = (orignialHour * 60) + orignalMin;
      let selectedAssignne;
      if (this.taskForm.get('assignee').value == '') {
        selectedAssignne = null;
      }
      else {
        selectedAssignne = this.taskForm.get('assignee').value
      }
      this.taskService.addTask({
        title: this.taskForm.get('title').value, description: this.taskForm.get('description').value,
        dueDate: addDueDate, priority: this.taskForm.get('priority').value, status: this.taskForm.get('status').value,
        estimatedTime: totalEstimatedMin, originalTime: totalOriginalTime, clientTime: totalClientMin,
        assignee: selectedAssignne, isDoubt: this.taskForm.get('isDoubt').value,
        action: 'Created'
      }).subscribe((res: any) => {
        if (res.data != "Error Cant Add") {
          swal('Success', 'Task is added :)', 'success');
        }
        else {
          swal('Warning', 'Task cannot be added :)', 'error')
        }
        // this.mailService.sendMail({ to: 'gautam.g@softobotics.com', subject: 'testing', text: 'hey this is good' }).subscribe((res: any) => {
        //   console.log(res)
        // })
        this.updateTaskList.emit(this.taskForm.value);
        document.getElementById("cancel").click();
        this.taskForm.reset();
        this.showCommentSecton = false;
      })
    }
  }


  updateTask(task) {
    if (this.userId && this.userList) {
      this.task = task;
    }
    if (this.task) {
      this.isEdit = true;
      this.showCommentButton = true;
      this.showTextButton = false;
      if (this.task.comments && this.task.comments.length != 0) {
        this.showCommentSecton = true;
      }
      this.taskTitle = 'Edit Task' + '\t' + '(TMS-' + this.task.taskId + ')';
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
      this.taskForm.get('title').setValue(this.task.title);
      this.taskForm.get('description').setValue(this.task.description);
      this.taskForm.get('priority').setValue(this.task.priority);
      this.taskForm.get('assignee').setValue(this.task.userId);
      this.taskForm.get('status').setValue(this.task.status);
      this.taskForm.get('isDoubt').setValue(this.task.isDoubt);
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
      this.isEdit = false;
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
        if (this.dueDate == undefined || new Date(this.dueDate).getFullYear() == 1970) {
          this.taskForm.get('assignee').setValue('');
        }
        else {
          this.taskForm.get('assignee').setValue(this.userId);
        }
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
    this.buttonText = "Save";
    this.totalEstimatedTime -= this.task.estimatedTime;
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
      text: "Task(TMS-" + this.task.taskId + ") will be deleted from database!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willRemove) => {
      if (willRemove) {
        // document.getElementById("cancel").click();
        this.onDeleteTaskPopUp();
      } else {
        swal('Cancelled', 'Task(TMS-' + this.task.taskId + ') is not deleted :)', 'error');
      }
    });
  }

  onDeleteTaskPopUp() {
    this.taskService.deleteTask(this.task.taskId).subscribe((res: any) => {
      swal('Deleted', 'Task(TMS-' + this.task.taskId + ') has been removed :)', 'warning');
      this.updateTaskList.emit();
      document.getElementById("cancel").click();
    });
  }


}
