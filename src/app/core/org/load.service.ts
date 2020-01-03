import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { CacheService } from '../../services';

@Injectable()
export class LoadService {

  menuItems: Array<any>;
  private route: string;
  private apiPath: string;
  user: any;

  constructor(private cacheService: CacheService,
    private httpClient: HttpClient) {
    const env: any = environment;
    this.route = 'auth';
    this.apiPath = env.paths.api;
  }


  setUserbyAPI() {
    if (this.cacheService.getCache('user') != null) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
        })
      };

      return new Promise((resolve, reject) => {
        this.httpClient.get(`${this.apiPath}/${this.route}/check-token`, httpOptions)
          .subscribe((response: any) => {
            this.user = response.user;
            resolve(true);
          },
          (err)=>
          {
            this.cacheService.removeCache('user');
            resolve(true);
          })
      })
    }
  }
}
