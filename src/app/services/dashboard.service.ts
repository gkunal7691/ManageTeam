import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiPath: string;
  private checkStatus:string;
  private checkWelcome:string;
  private userCount:string;
  private orgData:string;
 

  constructor(  private httpClient: HttpClient, private cacheService: CacheService, private loginService: LoginService) { 
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.checkStatus = 'userMeta';
    this.checkWelcome = 'userMeta/getValue';
    this.userCount = 'users/countuser';
    this.orgData = 'orgMeta';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
  }

  checkCloseStatus(val)
  {
    return this.httpClient.post<object>(`${this.apiPath}/${this.checkStatus}`, val, this.getHeaders())
  }
welcomeStatus(val)
{
  return this.httpClient.post<object>(`${this.apiPath}/${this.checkWelcome}`, val, this.getHeaders())
}

getCountUser(val)
{
  return this.httpClient.post<object>(`${this.apiPath}/${this.userCount}`, val, this.getHeaders())
}
saveOrgMeta(val)
{
  return this.httpClient.post<object>(`${this.apiPath}/${this.orgData}`, val)
}
getOrgData(orgId,metaKey)
{
  return this.httpClient.get<object>(`${this.apiPath}/${this.orgData}/${orgId}/${metaKey}`)
}


}
