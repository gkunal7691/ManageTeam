import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})

export class ManagePayslipService {
  private apiPath: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  addPaySlip(data) {
    return this.httpClient.post<object>(`${this.apiPath}/payslip/` + data.userId, data, this.getHeaders());
  }

  getPaySlipList(userId) {
    return this.httpClient.get<object>(`${this.apiPath}/payslip/` + userId, this.getHeaders());
  }

  getEmployeePaySlip() {
    return this.httpClient.get<object>(`${this.apiPath}/payslip/client/`, this.getHeaders());
  }

  updatePaySlip(data) {
    return this.httpClient.put<Object>(`${this.apiPath}/payslip/`, data, this.getHeaders());
  }

  deletePaySlip(payslipId) {
    return this.httpClient.delete<any>(`${this.apiPath}/payslip/` + payslipId, this.getHeaders());
  }
}