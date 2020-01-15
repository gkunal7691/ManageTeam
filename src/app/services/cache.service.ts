import { Injectable} from '@angular/core';

@Injectable()
export class CacheService {

  public  organizationDetail: any;

  constructor() {}

  setCache(name, val) {
    localStorage.setItem('softobotics-' + name, JSON.stringify(val));
  }

  getCache(name) {
    const cache = localStorage.getItem('softobotics-' + name);
    return cache ? JSON.parse(cache) : null;
  }

  removeCache(name) {
    localStorage.removeItem('softobotics-' + name);
  }

  setOrgDetails(val){
    this.organizationDetail = val;
  }

  getOrgDetails()
  {
    return this.organizationDetail;
  }

}
