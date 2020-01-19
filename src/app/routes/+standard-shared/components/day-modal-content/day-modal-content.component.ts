import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColorsService } from '../../../../shared/colors/colors.service';
import { TaskService } from '../../../../services/task.service';
import { Router } from '@angular/router';
const swal = require('sweetalert');


@Component({
  selector: 'app-day-modal-content',
  templateUrl: './day-modal-content.component.html',
  styleUrls: ['./day-modal-content.component.scss']
})
export class DayModalContentComponent implements OnInit {


  @Input() userId: number;
  @Input() userList: any;
  @Input() updatedTaskList: any;
  @Input() dueDate;
  @Output() getTask = new EventEmitter();
  // @Output() updateTaskList = new EventEmitter();


  calenderDate: any;
  taskDeatils: any;

  dayOffList: any;
  isDayOff: boolean;
  isHoliday: boolean;
  isLeaveRequested: boolean;

  modalCenter: boolean;

  nextDateModalForm: FormGroup;
  totalEstimatedTime: any;
  nextDate: any;
  nextDateValue: boolean;

  showDate: boolean;
  plannedTaskList: any[] = [];
  progressTaskList: any[] = [];
  completedTaskList: any[] = [];
  showupdatedtask: boolean;
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
  holidayList: any;
  leaveRequestList: any;

  ngOnChanges(changes: SimpleChanges) {

    console.log("userId", this.userId);
    console.log("userList", this.userList);
    console.log("dueDate", this.dueDate);
    console.log(this.updatedTaskList);
    console.log(this.updateTaskComment());
    // console.log("allTasksList",this.allTasksList)
    // console.log("currentUserId",this.currentUserId)  
    this.dateChange();
    this.getDayTask();
    // this.nextDateValue = true;
    this.stacked = [];
    this.newStacked = [];
    // this._date = this.showRecentDate;
    // this.taskList = this.allTasksList;
    //this.getDayTask();
    //if (this.taskValue) {
    //this.taskValue = this.allTasksList.find(task => task.taskId === this.taskValue.taskId);
    //}
    //this.taskCalculation();
    this.ref.detectChanges();
  }

  constructor(private ref: ChangeDetectorRef, public colors: ColorsService,
    private taskService: TaskService, private router: Router) { }

  ngOnInit() {

    // this.isDayOff = false;
    // this.isHoliday = false;

    // this.getDayTask();
  }

  getDayTask() {
    console.log(this.dueDate)
    this.taskList = [];
    let dueDate = this.dueDate.getFullYear() + '-' + (this.dueDate.getMonth() + 1) + '-' + this.dueDate.getDate();
    this.taskService.getDayDetails(this.userId, dueDate).subscribe((res: any) => {
      this.taskList = res.data;
      console.log(this.taskList)
      this.filterTaskList();
    });

  }

  filterTaskList() {
    let d = new Date(this.dueDate)
    console.log(this.taskList);
    if (this.taskList) {
      this.plannedTaskList = this.taskList.filter(task => task.status == "planned" && new Date(task.dueDate).getDate() == d.getDate())
      let plannedCrticalTask = this.plannedTaskList.filter(task => task.priority == "critical");
      let plannedHighTask = this.plannedTaskList.filter(task => task.priority == "high");
      let plannedNormalTask = this.plannedTaskList.filter(task => task.priority == "normal");
      let plannedLowTask = this.plannedTaskList.filter(task => task.priority == "low");
      this.plannedTaskList = plannedCrticalTask.concat(plannedHighTask, plannedNormalTask, plannedLowTask)
      console.log(this.plannedTaskList);
      this.progressTaskList = this.taskList.filter(task => task.status == "progress" && new Date(task.dueDate).getDate() == d.getDate())
      let progressCriticalTask = this.progressTaskList.filter(task => task.priority == "critical");
      let progressHighTask = this.progressTaskList.filter(task => task.priority == "high");
      let progressNormalTask = this.progressTaskList.filter(task => task.priority == "normal");
      let progressLowTask = this.progressTaskList.filter(task => task.priority == "low");
      this.progressTaskList = progressCriticalTask.concat(progressHighTask, progressNormalTask, progressLowTask)
      console.log(this.progressTaskList);
      this.completedTaskList = this.taskList.filter(task => task.status == "completed" && new Date(task.dueDate).getDate() == d.getDate())
      let completedCriticalTask = this.completedTaskList.filter(task => task.priority == "critical");
      let completedHighTask = this.completedTaskList.filter(task => task.priority == "high");
      let completedNormalTask = this.completedTaskList.filter(task => task.priority == "normal");
      let completedLowTask = this.completedTaskList.filter(task => task.priority == "low");
      this.completedTaskList = completedCriticalTask.concat(completedHighTask, completedNormalTask, completedLowTask)
      console.log(this.completedTaskList);
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
    if ('/employee/month-view' == this.router.url) {
      this.modalCenter = true;
    }
  }

  // getParticularTask(){
  //   this.taskList.find(x => )
  // }

  // getupadtedTask() {
  //   this.updateTaskList.emit();
  // }

  editTask(task) {
    console.log(task)
    this.getTask.emit(task);
  }

  addTask() {
    // this.task = {};
    //console.log(this.task)
  }

  taskCalculation() {
    this.clientTime = 0;
    this.orginalSpentTime = 0;
    this.estimatedTime = 0;
    this.taskList.forEach(task => {
      if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' +
        (new Date(task.dueDate).getFullYear())) == (new Date(this.dueDate).getDate() + '/' +
          (new Date(this.dueDate).getMonth() + 1) + '/' + (new Date(this.dueDate).getFullYear()))) {

        this.clientTime += task.clientTime;
        this.orginalSpentTime += task.originalTime;
        this.estimatedTime += task.estimatedTime;
      }
    });
    this.stacked.push({
      value: this.orginalSpentTime,
      type: "success"
    }, {
      value: (this.estimatedTime > this.orginalSpentTime) ? (this.estimatedTime - this.orginalSpentTime) : 0,
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


  getSelectedTaskDeatils(task) {
    this.taskDeatils = task;
    console.log(this.taskDeatils);
  }


  updateStatus(task, status) {
    if (status != 'completed') {
      this.taskService.editTask({
        status: status, taskId: task.taskId, dueDate: task.dueDate
      }).subscribe((res: any) => {
        this.getDayTask();
        if (status == 'progress') {
          status = 'In Progress';
        }
        swal('Success', 'Task #' + task.taskId + ' has been moved to ' + status + ' Tasks', 'success');
      })
    }
  }

  dateChange() {
    console.log(this.dueDate)
    this.getDayTask();
  }
  updateTaskComment(){
    console.log('Piyush')
  }
}
