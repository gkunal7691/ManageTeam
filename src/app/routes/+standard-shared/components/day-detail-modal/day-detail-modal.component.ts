import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../../services/login.service';
import { DayModalContentComponent } from '../day-modal-content/day-modal-content.component';

@Component({
  selector: 'app-day-detail-modal',
  templateUrl: './day-detail-modal.component.html',
  styleUrls: ['./day-detail-modal.component.scss']
})

export class DayDetailComponent implements OnInit, OnChanges {
  @Input() currentUserId: any;
  @Input() userList: any;
  @Input() showRecentDate: any;
  @Output() updateTaskList = new EventEmitter();
  @ViewChild(DayModalContentComponent, { static: true }) dayDetail: DayModalContentComponent;

  taskDeatils: any;
  showForm: boolean;

  dueDate: any;
  task: any;
  modalCenter: boolean;
  userId: number;
  taskValue: any;

  ngOnChanges(changes: SimpleChanges) {
    this.setModalStyle();
    this.ref.detectChanges();
  }

  constructor(private ref: ChangeDetectorRef, private loginSerivce: LoginService, private router: Router) {
    this.userId = this.loginSerivce.currentUser.id;
  }

  ngOnInit() { }

  getTask(task) {
    this.task = task;
  }

  setModalStyle() {
    this.dueDate = this.showRecentDate;
    // To set the modal in center  
    if ('/employee/edashboard' == this.router.url) {
      this.modalCenter = false;
    }
    if ('/employee/month-view' == this.router.url) {
      this.modalCenter = true;
    }
  }

  editTask(task) {
    this.taskValue = task;
  }

  addTask() {
    this.taskValue = {};
  }

  getSelectedTaskDeatils(task) {
    this.showForm = true;
    this.taskDeatils = task;
    console.log(this.taskDeatils);
  }

  getUpdatedTaskList(task) {
    this.dayDetail.getDayTask();
    this.updateTaskList.emit();
  }

}