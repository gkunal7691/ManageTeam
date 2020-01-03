import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AccountService {

  route: string;
  apiPath: string;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
    const env: any = environment;

    this.route = 'users';
    this.apiPath = env.paths.api;
  }

  getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.cacheService.getCache('user').token}`
    })
  }

  get(query = {}) {

    return this.httpClient.get<Object>(`${this.apiPath}/${this.route}`, { headers: this.getHeaders(), params: query });

  }

  getById(id) {

    return this.httpClient.get<Object>(`${this.apiPath}/${this.route}/${id}`);
  }

  add(newData) {

    return this.httpClient.post<Object>(`${this.apiPath}/${this.route}`, newData);
  }

  update(updatedData, id) {

    return this.httpClient.patch<Object>(`${this.apiPath}/${this.route}/${id}`, updatedData);
  }

  delete(id) {

    return this.httpClient.delete<Object>(`${this.apiPath}/${this.route}/${id}`);
  }

  getStatusList() {
    return [
      {
        value: 'active',
        title: 'Active',
      },
      {
        value: 'inactive',
        title: 'Inactive',
      },
    ];
  }

  getRolesList() {
    return [
      {
        value: 'admin',
        title: 'Admin',
      },
      {
        value: 'company',
        title: 'Company/Client',
      },
    ];
  }

  getEducationList() {
    return [
      {
        value: 'highschool',
        title: 'Some Highschool',
      },
      {
        value: 'college',
        title: 'Some College',
      },
      {
        value: 'collegedegree',
        title: 'College Degree',
      },
      {
        value: 'graduatedegree',
        title: 'Graduate Degree',
      },
    ];
  }

  getRiskList() {
    return [
      {
        value: 'low',
        title: 'Very Low - Protect my money',
      },
      {
        value: 'moderate',
        title: 'Moderate - Want some return',
      },
      {
        value: 'high',
        title: 'High - Want maximum return',
      },
    ];
  }

  getRoleByValue(value) {
    const role = this.getRolesList().find((item) => {
      return item.value === value;
    });

    return role ? role.title : '';
  }

  getStatusByValue(value) {
    const status = this.getStatusList().find((item) => {
      return item.value === value;
    });

    return status ? status.title : '';
  }

  getEducationByValue(value) {
    const education = this.getEducationList().find((item) => {
      return item.value === value;
    });

    return education ? education.title : '';
  }

  getRiskByValue(value) {
    const education = this.getRiskList().find((item) => {
      return item.value === value;
    });

    return education ? education.title : '';
  }

}