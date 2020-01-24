import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})

export class ForgotPasswordService {
  private route: string;
  private apiPath: string;
  private protocol: string;
  private host: string;
  private users: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    this.protocol = document.location.protocol
    this.host = document.location.host;
    const env: any = environment;
    this.apiPath = env.paths.api;
    this.route = 'auth';
    this.users = 'users';
  }

  getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
      })
    }
  }

  sendEmail(email: string, orgId: number) {
    return this.httpClient.delete<Object>(`${this.apiPath}/${this.route}/${email}/${orgId}`);
  }

  resetPassword(profileData) {
    return this.httpClient.put<Object>(`${this.apiPath}/${this.users}/`, profileData, this.getHeaders());
  }

}
