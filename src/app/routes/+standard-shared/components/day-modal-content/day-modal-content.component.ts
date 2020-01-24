import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ColorsService } from '../../../../shared/colors/colors.service';
import { TaskService } from '../../../../services/task.service';
import { Router } from '@angular/router';
const swal = require('sweetalert');

@Component({
  selector: 'app-day-modal-content',
  templateUrl: './day-modal-content.component.html',
  styleUrls: ['./day-modal-content.component.scss']
})

export class DayModalContentComponent implements OnInit, OnChanges {
  @Input() userId: number;
  @Input() userList: any;
  @Input() updatedTaskList: any;
  @Input() dueDate: any;
  @Output() getTask = new EventEmitter();
  @Output() addNewTask = new EventEmitter();
  @Output() getTotalEstimatedTime = new EventEmitter();

  calenderDate: any;
  task: any;

  modalCenter: boolean;

  plannedTaskList: any;
  progressTaskList: any;
  completedTaskList: any;
  stacked: any[] = [];
  newStacked: any[] = [];
  taskList: any;

  clientTime: any;
  orginalSpentTime: any;
  totalEstimatedTime: any;

  sparkOptionsInfo = {
    type: 'pie',
    sliceColors: [this.colors.byName('success'), this.colors.byName('danger')],
    height: 30
  };

  ngOnChanges(changes: SimpleChanges) {
    this.getDayTask();
    this.dateChange();
    this.ref.detectChanges();
  }

  constructor(private ref: ChangeDetectorRef, public colors: ColorsService,
    private taskService: TaskService, private router: Router) { }

  ngOnInit() { }

  getDayTask() {
    this.taskList = [];
    if (this.dueDate) {
      let dueDate = this.dueDate.getFullYear() + '-' + (this.dueDate.getMonth() + 1) + '-' + this.dueDate.getDate();
      this.taskService.getDayDetails(this.userId, dueDate).subscribe((res: any) => {
        this.taskList = res.data;
        this.filterTaskList();
      });
    }
  }

  filterTaskList() {
    this.newStacked = [];
    let d = new Date(this.dueDate)
    if (this.taskList) {
      this.plannedTaskList = this.taskList.filter(task => task.status == "planned" && new Date(task.dueDate).getDate() == d.getDate())
      let plannedCrticalTask = this.plannedTaskList.filter(task => task.priority == "critical");
      let plannedHighTask = this.plannedTaskList.filter(task => task.priority == "high");
      let plannedNormalTask = this.plannedTaskList.filter(task => task.priority == "normal");
      let plannedLowTask = this.plannedTaskList.filter(task => task.priority == "low");
      this.plannedTaskList = plannedCrticalTask.concat(plannedHighTask, plannedNormalTask, plannedLowTask);
      this.progressTaskList = this.taskList.filter(task => task.status == "progress" && new Date(task.dueDate).getDate() == d.getDate())
      let progressCriticalTask = this.progressTaskList.filter(task => task.priority == "critical");
      let progressHighTask = this.progressTaskList.filter(task => task.priority == "high");
      let progressNormalTask = this.progressTaskList.filter(task => task.priority == "normal");
      let progressLowTask = this.progressTaskList.filter(task => task.priority == "low");
      this.progressTaskList = progressCriticalTask.concat(progressHighTask, progressNormalTask, progressLowTask);
      this.completedTaskList = this.taskList.filter(task => task.status == "completed" && new Date(task.dueDate).getDate() == d.getDate())
      let completedCriticalTask = this.completedTaskList.filter(task => task.priority == "critical");
      let completedHighTask = this.completedTaskList.filter(task => task.priority == "high");
      let completedNormalTask = this.completedTaskList.filter(task => task.priority == "normal");
      let completedLowTask = this.completedTaskList.filter(task => task.priority == "low");
      this.completedTaskList = completedCriticalTask.concat(completedHighTask, completedNormalTask, completedLowTask);
      this.newStacked.push({
        value: this.completedTaskList.length,
        type: "success"
      }, {
        value: this.progressTaskList.length,
        type: "info"
      }, {
        value: this.plannedTaskList.length + this.progressTaskList.length + this.completedTaskList.length,
        type: "danger"
      })
    }

    this.taskCalculation();

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
    else if ('/employee/month-view' == this.router.url) {
      this.modalCenter = true;
      for (var i = 0; i < x.length; i++) {
        x[i].style.height = '300px';
      }
    }
  }

  taskCalculation() {
    this.stacked = [];
    this.clientTime = 0;
    this.orginalSpentTime = 0;
    this.totalEstimatedTime = 0;
    if (this.taskList) {
      this.taskList.forEach(task => {
        if ((new Date(task.dueDate).getDate() + '/' + (new Date(task.dueDate).getMonth() + 1) + '/' +
          (new Date(task.dueDate).getFullYear())) == (new Date(this.dueDate).getDate() + '/' +
            (new Date(this.dueDate).getMonth() + 1) + '/' + (new Date(this.dueDate).getFullYear()))) {
          this.clientTime += task.clientTime;
          this.orginalSpentTime += task.originalTime;
          this.totalEstimatedTime += task.estimatedTime;
        }
      })
      this.getTotalEstimatedTime.emit(this.totalEstimatedTime)
      this.stacked.push({
        value: this.orginalSpentTime,
        type: "success"
      }, {
        value: (this.totalEstimatedTime > this.orginalSpentTime) ? (this.totalEstimatedTime - this.orginalSpentTime) : 0,
        type: "info"
      }, {
        value: (this.orginalSpentTime + this.totalEstimatedTime) === 0 ? 0 : 480,
        type: "danger"
      });
    }
  }

  editTask(task) {
    this.getTask.emit(task);
  }

  addTask() {
    this.addNewTask.emit();
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

  // Method to refresh data on parent
  dateChange() {
    this.getDayTask();
  }
}
