import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SuperAdminService {
  private apiPath: string;
  private clientList: string;
  private createUser: string;
  private deleteUser: string;
  private notification: string;
  private getUserData: string;
  private userList: any;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api
    this.clientList = 'users/userlist';
    this.deleteUser = 'users';
    this.createUser = 'users/superAdmin/createUser';
    this.notification = 'notification';
    this.userList = 'users/superAdmin/userList';
    this.getUserData = 'userInfo';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getAdminList(orgId) {
    return this.httpClient.get<object>(`${this.apiPath}/${this.clientList}/` + orgId + '/2', this.getHeaders())
  }

  addUser(value) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.createUser}/`, value, this.getHeaders())
  }

  deleteClient(id) {
    return this.httpClient.delete<object>(`${this.apiPath}/${this.deleteUser}/` + id, this.getHeaders())
  }

  setNotication(val) {
    return this.httpClient.put<any>(`${this.apiPath}/${this.notification}/`, val)
  }

  getNotification() {
    return this.httpClient.get<any>(`${this.apiPath}/${this.notification}/`)
  }

  getUserList() {
    return this.httpClient.get<any>(`${this.apiPath}/${this.userList}`, this.getHeaders());
  }

  addUserInfo(value) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.getUserData}/`, value, this.getHeaders())
  }

  getUserInfo(userId) {
    return this.httpClient.get<any>(`${this.apiPath}/${this.getUserData}/` + userId, this.getHeaders())
  }

  updateUserData(data) {
    return this.httpClient.put<Object>(`${this.apiPath}/users/superAdmin/updateUser`, data, this.getHeaders());
  }
  deleteUserData(id) {
    return this.httpClient.delete<object>(`${this.apiPath}/${this.deleteUser}/` + id, this.getHeaders())
  }
}