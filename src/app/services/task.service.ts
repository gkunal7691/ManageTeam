import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiPath: string;
  private task: string;
  private getTask: string;
  private dayTask: string;
  private backlogTask: string;
  private upcomingTask: string;
  private reOrder: string;
  private searchTask: string;
  private selectedDateTask: string;


  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.task = 'task';
    this.getTask = 'task/month-view';
    this.searchTask = 'task/search-tasks';
    this.dayTask = 'task/get-day-task';
    this.backlogTask = 'task/backlog/getTask';
    this.upcomingTask = 'task/upcoming-task';
    this.reOrder = 'task/edit/reOrder';
    this.selectedDateTask = 'task/get-selected-date-estimate';

  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getTaskList(dueDate, userId) {
    return this.httpClient.get<object>(`${this.apiPath}/${this.getTask}/` + dueDate + '/' + userId, this.getHeaders())
  }

  getDayDetails(userId: number, dueDate: string) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.dayTask}/` + userId, { dueDate: dueDate }, this.getHeaders())
  }

  getBacklogTasks(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.backlogTask}/`, val, this.getHeaders())
  }

  getSelectedDateTask(userId: number, selectedDueDate: string) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.selectedDateTask}/` + userId, { dueDate: selectedDueDate }, this.getHeaders())
  }

  getSingleTask(taskId) {
    return this.httpClient.get<object>(`${this.apiPath}/${this.task}/` + taskId, this.getHeaders())
  }

  getUpcomingTasks(dueDate) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.upcomingTask}/`, dueDate, this.getHeaders())
  }

  addTask(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.task}/`, val, this.getHeaders())
  }

  editTask(value) {
    return this.httpClient.put<object>(`${this.apiPath}/${this.task}/`, value, this.getHeaders())
  }

  deleteTask(taskId) {
    return this.httpClient.delete<object>(`${this.apiPath}/${this.task}/` + taskId, this.getHeaders())
  }

  reOrderMenu(taskList) {
    return this.httpClient.put<object>(`${this.apiPath}/${this.reOrder}/`, taskList, this.getHeaders())
  }

  searchTasks(value) {
    return this.httpClient.get<object>(`${this.apiPath}/${this.searchTask}/` + value, this.getHeaders())
  }

  compareDate(dueDate, noOfDays) {
    let duedate = new Date(dueDate)
    let compareDate = new Date(new Date().setDate(new Date().getDate() - noOfDays));
    duedate.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    if (duedate.getFullYear() == 1970) {
      return true;
    }
    else {
      return duedate.getTime() >= compareDate.getTime();
    }
  }

}
