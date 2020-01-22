import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiPath: string;
  private employeeList:string;
  private adminList:string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {

    const env: any = environment;
    this.apiPath = env.paths.api;
    this.employeeList = 'user/employee'
    this.adminList = 'users/admin/allAdminList'
   }

   getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getEmployeeList(){
    return this.httpClient.get<any>(`${this.apiPath}/${this.employeeList}`, this.getHeaders())
  }

  getAllAdminList(){
    return this.httpClient.get<any>(`${this.apiPath}/${this.adminList}`, this.getHeaders())
  }
}
