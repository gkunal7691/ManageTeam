import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class Dashboardv3Component implements OnInit, AfterViewInit {
  currentDate: Date = new Date();
  convertedDate: Date;
  taskList: any[] = [];
  showLoader: boolean = true;
  showButton: boolean = true;
  divHeight: any;
  @ViewChild('showModal', { static: true }) myDiv: ElementRef<HTMLElement>;
  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.divHeight = (window.innerHeight - 49) + 'px';
    this.currentDate.setHours(0, 0, 0);
    this.getTaskList();
    this.goToPresentDay();
  }

  ngAfterViewInit() {
    // let el: HTMLElement = this.myDiv.nativeElement;
    // el.click();
  }

  getTaskList() {
    this.showLoader = true;
    this.convertedDate = new Date(this.currentDate);
    let currentDay = this.convertedDate.getFullYear() + '-' + (this.convertedDate.getMonth() + 1) + '-' + this.convertedDate.getDate();
    this.taskService.getSingleTask({ dueDate: currentDay }).subscribe((res: any) => {
      this.taskList = res.data;
      this.showLoader = false;
    });
  }

  getPreviousDate() {
    this.showLoader = true;
    this.taskList = [];
    this.currentDate.setDate(this.currentDate.getDate() - 1);
    this.convertedDate = new Date(this.currentDate);
    let previousDate = this.convertedDate.getFullYear() + '-' + (this.convertedDate.getMonth() + 1) + '-' + this.convertedDate.getDate();
    this.taskService.getSingleTask({ dueDate: previousDate }).subscribe((res: any) => {
      this.taskList = res.data;
      this.showLoader = false;
    });
  }

  getNextDate() {
    this.showLoader = true;
    this.taskList = [];
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.convertedDate = new Date(this.currentDate);
    let nextDate = this.convertedDate.getFullYear() + '-' + (this.convertedDate.getMonth() + 1) + '-' + this.convertedDate.getDate();
    this.taskService.getSingleTask({ dueDate: nextDate }).subscribe((res: any) => {
      this.taskList = res.data;
      this.showLoader = false;
    })
  }

  goToPresentDay() {
    this.showLoader = true;
    this.taskList = [];
    let newDate: Date = new Date();
    this.convertedDate = new Date(newDate);
    let currentDay = this.convertedDate.getFullYear() + '-' + (this.convertedDate.getMonth() + 1) + '-' + this.convertedDate.getDate();
    this.taskService.getSingleTask({ dueDate: currentDay }).subscribe((res: any) => {
      this.taskList = res.data;
      this.showLoader = false;
    })
  }
}
