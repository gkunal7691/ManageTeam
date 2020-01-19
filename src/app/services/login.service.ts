import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable()
export class LoginService {
  protected authenticated: boolean;
  private route: string;
  private apiPath: string;
  private user: any;
  
  constructor(
    private cacheService: CacheService,
    private httpClient: HttpClient,
  ) {
    const env: any = environment;

    this.route = 'auth';
    this.apiPath = env.paths.api;
    this.authenticated = !!this.cacheService.getCache('user');
  }

  async login(email: string, password: string): Promise<{ success: boolean }> {
    const organizationId = this.cacheService.getOrgDetails().organizationId;
    try {
      const res: any = await this.httpClient.post<Object>(`${this.apiPath}/${this.route}`, {
        email,
        password,
        organizationId
      }).toPromise();

      if (res.data && res.data.token) {

        this.authenticated = true;

        this.cacheService.setCache('user', res.data);

        return of({ success: true, res }).toPromise();
      } else {

        return of({ success: false, ...res }).toPromise();
      }

    } catch (e) {
      return of({ success: false }).toPromise();
    }

  }

  logout() {
    this.authenticated = false;

    this.cacheService.removeCache('user');
  }

  get isAuthenticated(): boolean {
    return this.authenticated;
  }

  setUser(user) {
    this.user = user;
  }

  get currentUser() {
    return this.user;
  }

  get currentOrg(){
    return this.cacheService.getOrgDetails();
  }

  checkToken() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    };
    return this.httpClient.get(`${this.apiPath}/${this.route}/check-token`, httpOptions).toPromise();
  }
}