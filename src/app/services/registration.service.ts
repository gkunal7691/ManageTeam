import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {User} from './classes/user';
import { environment } from '../../environments/environment';

@Injectable()
export class RegistrationService {
  private route: string;
  private route1:string;
  private apiPath: string;
  

  constructor(
    private httpClient: HttpClient,
  ) {
    const env: any = environment;

    this.route = 'users';
    this.route1='usersentiment';
    this.apiPath = env.paths.api;
  }


  checkEmail(query = {}) {
    return this.httpClient.get<Object>(`${this.apiPath}/auth`, {params : query});
  }

  register(profileData: User) {
    return this.httpClient.post<Object>(`${this.apiPath}/${this.route}`, profileData);
  }

  getSentimentType(){
    return this.httpClient.get<Object>(`${this.apiPath}/${this.route1}`)
  }

  setSentiment(val:any){
   
    return this.httpClient.post<Object>(`${this.apiPath}/${this.route1}`, val);
  }
}