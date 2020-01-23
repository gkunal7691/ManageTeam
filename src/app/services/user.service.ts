import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable()

export class UserService {
  route: string;
  employeeRoute: string;
  apiPath: string;
  singleUser: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.route = 'users';
    this.employeeRoute = 'user';
    this.employeeRoute = 'user';
    this.singleUser = 'user/singleUser';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  get(query = {}) {
    return this.httpClient.get<Object>(`${this.apiPath}/${this.route}`, this.getHeaders());
  }

  getById(id) {
    return this.httpClient.get<Object>(`${this.apiPath}/${this.route}/${id}`);
  }

  add(newData) {
    return this.httpClient.post<Object>(`${this.apiPath}/${this.route}`, newData);
  }

  update(updatedData, id) {
    return this.httpClient.patch<Object>(`${this.apiPath}/${this.route}/${id}`, updatedData);
  }

  delete(id) {
    return this.httpClient.delete<Object>(`${this.apiPath}/${this.route}/${id}`);
  }

  getEmployees() {
    return this.httpClient.get<Object>(`${this.apiPath}/${this.employeeRoute}` + '/employee', this.getHeaders());
  }

  getSingleUser(userId) {
    return this.httpClient.get<Object>(`${this.apiPath}/${this.singleUser}/` + userId , this.getHeaders());
  }

}