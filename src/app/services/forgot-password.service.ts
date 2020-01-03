import { Injectable, Inject } from '@angular/core';

import {HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private route: string;
  private apiPath: string;
  private protocol:string;
  private host:string;


  constructor( 
    private httpClient: HttpClient,
  ) {
    this.protocol = document.location.protocol 
    this.host=document.location.host;

    const env: any = environment;

    this.route = 'auth';
    this.apiPath = env.paths.api;
   }

   sendEmail(email:string,orgId:number) {
    return this.httpClient.delete<Object>(`${this.apiPath}/${this.route}/${email}/${orgId}`);
  }

  

  resetPassword(profileData:Object){
    return this.httpClient.patch<Object>(`${this.apiPath}/${this.route}/`, profileData);
  }

}
