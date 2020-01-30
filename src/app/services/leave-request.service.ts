import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})

export class LeaveRequestService {
  private apiPath: string;
  private leaveRequest: any;
  private leaveRequestlist:any;
  private singleLeaveData: any;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) { 
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.leaveRequest = 'leave';
    this.leaveRequestlist = 'leave/leaverequestlist';
    this.singleLeaveData = 'leave';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    }
  }

  getLeaveRequestList(val){
    return this.httpClient.post<object>(`${this.apiPath}/${this.leaveRequestlist}/`,val,this.getHeaders());
  }

  updateLeaveStatus(val){
    return this.httpClient.put<object>(`${this.apiPath}/${this.leaveRequest}/`, val,this.getHeaders());
  }

  getSingleLeaveData(userId) {
    return this.httpClient.get<object>(`${this.apiPath}/${this.singleLeaveData}/`+userId, this.getHeaders());
  }
  
}
