import { Injectable} from '@angular/core';

@Injectable()
export class CacheService {

  public  organizationDetail: any;

  constructor() {}

  setCache(name, val) {
    localStorage.setItem('robocore-' + name, JSON.stringify(val));
  }

  getCache(name) {
    const cache = localStorage.getItem('robocore-' + name);
    return cache ? JSON.parse(cache) : null;
  }

  removeCache(name) {
    localStorage.removeItem('robocore-' + name);
  }

  setOrgDetails(val){
    this.organizationDetail = val;
  }

  getOrgDetails()
  {
    return this.organizationDetail;
  }

}
