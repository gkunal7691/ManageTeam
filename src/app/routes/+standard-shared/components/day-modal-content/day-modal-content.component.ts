import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ColorsService } from '../../../../shared/colors/colors.service';
import { TaskService } from '../../../../services/task.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-day-modal-content',
  templateUrl: './day-modal-content.component.html',
  styleUrls: ['./day-modal-content.component.scss']
})
export class DayModalContentComponent implements OnInit {


  @Input() currentUserId: any;
  @Input() userList: any;
  @Input() showRecentDate;
  @Input() allTasksList;
  @Output() updateTaskList = new EventEmitter();


  taskId: number;
  calenderDate: any;
  taskDeatils: any;
  status: any;
  showForm: boolean;

  dayOffList: any;
  isDayOff: boolean;
  isHoliday: boolean;
  isLeaveRequested: boolean;

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
  holidayList: any;
  leaveRequestList: any;

  ngOnChanges(changes: SimpleChanges) {

    console.log("currentUserId",this.currentUserId)
    console.log("userList",this.userList)
    console.log("showRecentDate",this.showRecentDate)
    console.log("allTasksList",this.allTasksList)
    console.log("currentUserId",this.currentUserId)


    this.ngOnInit();
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
    private taskService: TaskService, private router: Router) { }

  ngOnInit() {

    this.isDayOff = false;
    this.isHoliday = false;
    

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

    console.log(this.plannedTaskList);
    console.log(this.progressTaskList);
    console.log(this.completedTaskList);

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
      if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' +
        (new Date(task.dueDate).getFullYear())) == (new Date(this._date).getDate() + '/' +
          (new Date(this._date).getMonth() + 1) + '/' + (new Date(this._date).getFullYear()))) {

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
    this.showForm = true;
    this.taskDeatils = task;
    console.log(this.taskDeatils);
  }

  addNewTask() {
    let newEstimatedHour = this.nextDateModalForm.get('newEstimatedHour').value;
    let newEstimatedMin = this.nextDateModalForm.get('newEstimatedMin').value;
    this.totalEstimatedTime = (newEstimatedHour * 60) + newEstimatedMin;

    this.taskService.editTask({
      taskId: this.taskDeatils.taskId, clonned: 'Yes'
    }).subscribe((res: any) => {
      document.getElementById("cancel").click();
      // this.closeNextDateModal();
      this.getupadtedTask();
    })
  }
}
