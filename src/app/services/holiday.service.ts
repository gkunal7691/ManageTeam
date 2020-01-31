import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiPath: string;
  private holiday: any;
  private holidayDelete: any;

 

  constructor(private httpClient: HttpClient, private cacheService: CacheService) { 
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.holiday = 'holiday';
    this.holidayDelete = 'holiday/delete';
  
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    }
  }

  createHolidayList(val){
    return this.httpClient.post<object>(`${this.apiPath}/${this.holiday}/`,val,this.getHeaders());
  }

  getHolidayList(){
    return this.httpClient.get<object>(`${this.apiPath}/${this.holiday}/`,this.getHeaders());
  }
  
  updateHoliday(holidayId){
    return this.httpClient.put<object>(`${this.apiPath}/${this.holiday}/`,holidayId, this.getHeaders());
  }

  deleteHoliday(holidayId){
    return this.httpClient.put<object>(`${this.apiPath}/${this.holidayDelete}/`,holidayId , this.getHeaders());
  }
}
