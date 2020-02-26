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

  getPaySlipList(data) {
    return this.httpClient.get<object>(`${this.apiPath}/payslip/` + data.year + '/' + data.month + '/' + data.userId, this.getHeaders());
  }

  getEmployeePaySlip(data) {
    return this.httpClient.get<object>(`${this.apiPath}/payslip/client/` + data.year + '/' + data.month, this.getHeaders());
  }

  updatePaySlip(data) {
    console.log(data);
    return this.httpClient.put<Object>(`${this.apiPath}/payslip/`, data, this.getHeaders());
  }

  deletePaySlip(payslipId) {
    return this.httpClient.delete<any>(`${this.apiPath}/payslip/` + payslipId, this.getHeaders());
  }
}