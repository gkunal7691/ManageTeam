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
  private comment: string;
  private getTask: string;
  private getUserTask: string;
  private singleTask: string;


  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.task = 'task';
    this.comment = 'comment';
    this.getTask = 'task/getTask/dueDate';
    this.getUserTask = 'task/getTask/dueDate/admin'
    this.singleTask = 'task/getSingleTask'

  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getTaskList(duedate) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.getTask}/`, duedate, this.getHeaders())
  }

  getSingleTask(dueDate) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.singleTask}/`, dueDate, this.getHeaders())
  }

  getEachUserTask(value) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.getUserTask}/`, value, this.getHeaders())
  }

  addTask(val) {
    console.log(val)
    return this.httpClient.post<object>(`${this.apiPath}/${this.task}/`, val, this.getHeaders())
  }

  addComment(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.comment}/`, val, this.getHeaders())
  }

  editTask(value) {
    return this.httpClient.put<object>(`${this.apiPath}/${this.task}/`, value, this.getHeaders())
  }

  deleteTask(taskId) {
    return this.httpClient.delete<object>(`${this.apiPath}/${this.task}/` + taskId, this.getHeaders())
  }
}
