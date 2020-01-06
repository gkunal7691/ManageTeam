import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ColorsService } from '../../../shared/colors/colors.service';
import { TaskService } from '../../../services/task.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
const swal = require('sweetalert');

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss']
})

export class DayDetailComponent implements OnInit, OnChanges {
  @Input() showRecentDate;
  @Input() allTasksList;
  @Output() updateTaskList = new EventEmitter();

  estimateTimeModalForm: FormGroup;
  totalOriginalTime: any;
  totalClientTime: any;
  taskId: number;
  calenderDate: any;
  taskDeatils: any;
  status: any;
  showForm: boolean;

  modalCenter: boolean;

  nextDateModalForm: FormGroup;
  totalEstimatedTime: any;
  nextDate: any;
  nextDateValue: boolean;

  _date: Date;
  showDate: boolean;
  plannedTaskList: any[] = [];
  progressTaskList: any[] = [];
  completedTaskList: any[] = [];
  showupdatedtask: boolean;
  taskValue: any;
  edit: boolean = false;
  selectedTask: any;
  stacked: any[] = [];
  newStacked: any[] = [];
  clientTime: any;
  orginalSpentTime: any;
  taskList: any[] = [];
  estimatedTime: any;
  sparkOptionsInfo = {
    type: 'pie',
    sliceColors: [this.colors.byName('success'), this.colors.byName('danger')],
    height: 30
  };

  bsValue = new Date();
  bsConfig = {
    containerClass: 'theme-angle'
  }

  ngOnChanges(changes: SimpleChanges) {
    this.nextDateValue = true;

    this.stacked = [];
    this.newStacked = [];
    this._date = this.showRecentDate;
    this.taskList = this.allTasksList;
    this.getTaskList();
    if (this.taskValue) {
      this.taskValue = this.allTasksList.find(task => task.taskId === this.taskValue.taskId);
    }
    this.taskCalculation();
    this.ref.detectChanges();
  }
  constructor(private ref: ChangeDetectorRef, public colors: ColorsService,
    private taskService: TaskService, private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.estimateTimeModalForm = this.fb.group({
      newOriginalHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newOriginalMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newClientHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newClientMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]]
    })

    this.nextDateModalForm = this.fb.group({
      newEstimatedHour: ['', [Validators.required, Validators.maxLength(2), Validators.max(8)]],
      newEstimatedMin: ['', [Validators.required, Validators.maxLength(2), Validators.max(59)]],
      newDate: [''],
      newNextDate: ['']
    })
  }

  getTaskList() {
    let d = new Date(this._date)
    if (this.allTasksList) {
      this.plannedTaskList = this.allTasksList.filter(task => task.status == "planned" && new Date(task.dueDate).getDate() == d.getDate())
      let plannedCrticalTask = this.plannedTaskList.filter(task => task.priority == "critical");
      let plannedHighTask = this.plannedTaskList.filter(task => task.priority == "high");
      let plannedNormalTask = this.plannedTaskList.filter(task => task.priority == "normal");
      let plannedLowTask = this.plannedTaskList.filter(task => task.priority == "low");
      this.plannedTaskList = plannedCrticalTask.concat(plannedHighTask, plannedNormalTask, plannedLowTask)

      this.progressTaskList = this.allTasksList.filter(task => task.status == "progress" && new Date(task.dueDate).getDate() == d.getDate())
      let progressCriticalTask = this.progressTaskList.filter(task => task.priority == "critical");
      let progressHighTask = this.progressTaskList.filter(task => task.priority == "high");
      let progressNormalTask = this.progressTaskList.filter(task => task.priority == "normal");
      let progressLowTask = this.progressTaskList.filter(task => task.priority == "low");
      this.progressTaskList = progressCriticalTask.concat(progressHighTask, progressNormalTask, progressLowTask)

      this.completedTaskList = this.allTasksList.filter(task => task.status == "completed" && new Date(task.dueDate).getDate() == d.getDate())
      let completedCriticalTask = this.completedTaskList.filter(task => task.priority == "critical");
      let completedHighTask = this.completedTaskList.filter(task => task.priority == "high");
      let completedNormalTask = this.completedTaskList.filter(task => task.priority == "normal");
      let completedLowTask = this.completedTaskList.filter(task => task.priority == "low");
      this.completedTaskList = completedCriticalTask.concat(completedHighTask, completedNormalTask, completedLowTask)
    }

    // To set the hieght of tabset
    var x = <HTMLElement[]><any>document.getElementsByClassName("tab-content")
    if ((this.plannedTaskList.length + this.progressTaskList.length + this.completedTaskList.length) > 10) {
      for (var i = 0; i < x.length; i++) {
        x[i].style.height = 'unset';
      }
    }
    else {
      for (var i = 0; i < x.length; i++) {
        x[i].style.height = '300px';
      }
    }

    // To set the modal in center  
    if ('/employee/edashboard' == this.router.url) {
      this.modalCenter = false;
    }
    if ('/employee/time-attendance' == this.router.url) {
      this.modalCenter = true;
    }
  }

  getupadtedTask() {
    this.updateTaskList.emit();
  }

  editTask(task) {
    this.taskValue = task;
    this.edit = true;
  }

  addTask() {
    this.taskValue = {};
    this.edit = false;
  }

  taskCalculation() {
    this.clientTime = 0;
    this.orginalSpentTime = 0;
    this.estimatedTime = 0;
    this.allTasksList.forEach(task => {
      if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' + (new Date(task.dueDate).getFullYear())) == (new Date(this._date).getDate() + '/' + (new Date(this._date).getMonth() + 1) + '/' + (new Date(this._date).getFullYear()))) {
        this.clientTime += task.clientTime;
        this.orginalSpentTime += task.originalTime;
        this.estimatedTime += task.estimatedTime;
      }
    })
    this.stacked.push({
      value: this.orginalSpentTime,
      type: "success"
    }, {
      value: (this.estimatedTime > this.orginalSpentTime) ? (this.estimatedTime - this.orginalSpentTime) : -1 * (this.estimatedTime - this.orginalSpentTime),
      type: "info"
    }, {
      value: (this.orginalSpentTime + this.estimatedTime) === 0 ? 0 : 480,
      type: "danger"
    });

    this.newStacked.push({
      value: this.completedTaskList.length,
      type: "success"
    }, {
      value: this.progressTaskList.length,
      type: "info"
    }, {
      value: (this.plannedTaskList.length + this.progressTaskList.length + this.completedTaskList.length),
      type: "danger"
    })
  }

  updateStatus(task, status) {
    if (task.originalTime != 0 && task.clientTime != 0) {
      let spentHour = Math.floor(task.originalTime / 60);
      let spentMin = Math.floor(task.originalTime - spentHour * 60);
      let clientHour = Math.floor(task.clientTime / 60);
      let clientMin = Math.floor(task.clientTime - clientHour * 60);
      this.estimateTimeModalForm.get('newOriginalHour').setValue(spentHour);
      this.estimateTimeModalForm.get('newOriginalMin').setValue(spentMin);
      this.estimateTimeModalForm.get('newClientHour').setValue(clientHour);
      this.estimateTimeModalForm.get('newClientMin').setValue(clientMin);
    }
    else {
      this.estimateTimeModalForm.reset();
    }
    this.status = status;
    console.log(this.status)
    this.taskId = task.taskId;
    this.showForm = true;
    if (status != 'completed') {
      this.taskService.editTask({
        status: status, taskId: task.taskId
      }).subscribe((res: any) => {
        this.getTaskList();
        this.getupadtedTask();
        let st: any;
        if (this.status == 'progress') {
          this.status = 'In Progress';
        }
        swal('Success', 'Task(#' + this.taskId + ') has been moved to ' + this.status + ' Tasks', 'success');
      })
    }
  }

  exitModal() {
    var x = document.getElementById("testing")
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.estimateTimeModalForm.reset();
  }

  closeNextDateModal() {
    var x = document.getElementById("testing")
    setTimeout(() => { x.classList.add("modal-open") }, 350);
    this.nextDateModalForm.reset();
  }

  addNewEstimateTime() {
    let newClientHour = this.estimateTimeModalForm.get('newClientHour').value;
    let newClientMin = this.estimateTimeModalForm.get('newClientMin').value;
    this.totalClientTime = (newClientHour * 60) + newClientMin;
    let newOriginalHour = this.estimateTimeModalForm.get('newOriginalHour').value;
    let newOriginalMin = this.estimateTimeModalForm.get('newOriginalMin').value;
    this.totalOriginalTime = (newOriginalHour * 60) + newOriginalMin;
    this.taskService.editTask({
      originalTime: this.totalOriginalTime, clientTime: this.totalClientTime, taskId: this.taskId, status: this.status
    }).subscribe((res: any) => {
      this.exitModal();
      this.getupadtedTask();
      swal('Success', 'Task(#' + this.taskId + ') has been moved to ' + this.status + ' Tasks', 'success');
    })
  }

  getNewDate(val) {
    this.calenderDate = val;
  }

  getSelectedTaskDeatils(task) {
    this.showForm = true;
    this.taskDeatils = task;
    console.log(this.taskDeatils)
  }

  addNewTask() {
    let newEstimatedHour = this.nextDateModalForm.get('newEstimatedHour').value;
    let newEstimatedMin = this.nextDateModalForm.get('newEstimatedMin').value;
    this.totalEstimatedTime = (newEstimatedHour * 60) + newEstimatedMin;
    this.taskService.editTask({
      taskId: this.taskDeatils.taskId, clonned: 'Yes'
    }).subscribe((res: any) => {
      this.closeNextDateModal();
      this.getupadtedTask();
    })
    console.log(this.calenderDate)
    console.log(this.nextDate)
    if (this.calenderDate) {
      this.taskService.addTask({
        title: this.taskDeatils.title, description: this.taskDeatils.description,
        dueDate: this.calenderDate, priority: this.taskDeatils.priority, status: this.taskDeatils.status,
        estimatedTime: this.totalEstimatedTime, originalTime: this.taskDeatils.originalTime, clientTime: this.taskDeatils.clientTime,
        assignee: this.taskDeatils.userId,
      }).subscribe((res: any) => {
        console.log(res.data)
        this.closeNextDateModal();
        this.getupadtedTask();
      })
    }
    if (this.nextDate) {
      console.log(this.nextDate)
      this.taskService.addTask({
        title: this.taskDeatils.title, description: this.taskDeatils.description,
        dueDate: this.nextDate, priority: this.taskDeatils.priority, status: this.taskDeatils.status,
        estimatedTime: this.totalEstimatedTime, originalTime: this.taskDeatils.originalTime, clientTime: this.taskDeatils.clientTime,
        assignee: this.taskDeatils.userId,
      }).subscribe((res: any) => {
        console.log(res.data)
        this.exitModal();
        this.getupadtedTask();
      })
    }
  }

  moveToNextDate() {
    this.nextDateValue = false;
    console.log(this._date)
    let addnextDate = (new Date(this._date).getMonth() + 1) + '/' + (new Date(this._date).getDate() + 1) + '/' + (new Date(this._date).getFullYear());
    this.nextDate = new Date(addnextDate);
    this.nextDate.setHours(this.nextDate.getHours() + 5, 30);
    console.log(this.nextDate)
    this.nextDateModalForm.get('newNextDate').setValue(addnextDate)
  }

}