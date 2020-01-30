import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class DayoffService {

  private apiPath: string;
  private dayoff: any;
  private dayoffDelete: any;

 

  constructor(private httpClient: HttpClient, private cacheService: CacheService) { 
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.dayoff = 'dayoff';
    this.dayoffDelete = 'dayoff/delete';
  
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    }
  }

  createDayoffList(val){
    return this.httpClient.post<object>(`${this.apiPath}/${this.dayoff}`,{weekdayId:val},this.getHeaders());
  }

  getDayoffList(){
    return this.httpClient.get<object>(`${this.apiPath}/${this.dayoff}`,this.getHeaders());
  }
  
  updateDayoff(val){
    return this.httpClient.put<object>(`${this.apiPath}/${this.dayoff}`,val, this.getHeaders());
  }

  deleteDayoff(holidayId){
    return this.httpClient.put<object>(`${this.apiPath}/${this.dayoffDelete}/`,holidayId , this.getHeaders());
  }
}
