import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiPath: string;
  private todo: string;
  private todoDelete: string;
  private todoComplete: string;
  private todoStar: string;
  private completetodoList: string;
  private incompletetodoList: string;
  private allcompleteTOdo: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.todo = 'todo';
    this.todoDelete = 'todo/delete';
    this.todoComplete = 'todo/complete';
    this.todoStar = 'todo/star';
    this.completetodoList = 'todo/completetodolist';
    this.incompletetodoList = 'todo/incompletetodo';
    this.allcompleteTOdo = 'todo/allcompletetodolist';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  addTodo(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.todo}/`, val, this.getHeaders())
  }

  completeTodoList(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.completetodoList}/`, val, this.getHeaders())
  }

  incompleteTodoList(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.incompletetodoList}/`, val, this.getHeaders())
  }

  allCompleteTodoList(val) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.allcompleteTOdo}/`, val, this.getHeaders())
  }

  updateTodo(todoId) {
    return this.httpClient.put<any>(`${this.apiPath}/${this.todo}/`, todoId, this.getHeaders())
  }

  deleteTodo(todoId) {
    return this.httpClient.put<any>(`${this.apiPath}/${this.todoDelete}/`, todoId, this.getHeaders())
  }

  completeTodo(value) {

    return this.httpClient.put<any>(`${this.apiPath}/${this.todoComplete}/`, value, this.getHeaders())
  }

  updateStar(value) {
    console.log(value)
    return this.httpClient.put<any>(`${this.apiPath}/${this.todoStar}/`, value, this.getHeaders())
  }

}
