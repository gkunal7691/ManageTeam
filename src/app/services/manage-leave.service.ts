import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ManageLeaveService {
  private apiPath: string;
  private leaveRequest: any;
  private manageleaveList: any;
  private status:string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {

    const env: any = environment;
    this.apiPath = env.paths.api;
    this.leaveRequest = 'leave';
    this.manageleaveList = 'leave/manageleavelist';
    this.status = 'leave/cancel';
  }
  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    }
  }

  getManageLeaveList(status) {
    return this.httpClient.post<object>(`${this.apiPath}/${this.manageleaveList}/`,status, this.getHeaders());
  }

  createLeaveRequest(val) {
    return this.httpClient.post<Object>(`${this.apiPath}/${this.leaveRequest}/`, val, this.getHeaders())
  }

  getTotalLeaves() {
    return this.httpClient.get<object>(`${this.apiPath}/${this.leaveRequest}/`, this.getHeaders());
  }

  
  updateStatus(leaveId) {
    return this.httpClient.put<Object>(`${this.apiPath}/${this.status}/`,leaveId, this.getHeaders())
  }

}
