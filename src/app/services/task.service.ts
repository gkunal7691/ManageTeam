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
  private getUserTask: string;
  private dayTask: string;


  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.task = 'task';
    this.getTask = 'task/getTask/dueDate';
    this.getUserTask = 'task/getTask/dueDate/admin'
    this.dayTask = 'task/get-day-task'

  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getTaskList(dueDate) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.getTask}/`, dueDate, this.getHeaders())
  }

  getDayDetails(userId: number, dueDate: string) {
    console.log(userId, dueDate)
    return this.httpClient.post<object>(`${this.apiPath}/${this.dayTask}/` + userId, { dueDate: dueDate }, this.getHeaders())
  }

  getEachUserTask(value) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.getUserTask}/`, value, this.getHeaders())
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
}
