import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeekdayService {

  private apiPath: string;
  private weekDay: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.weekDay = 'weekday';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  getWeekDay(){
    return this.httpClient.get<object>(`${this.apiPath}/${this.weekDay}`,this.getHeaders());
  }
}
