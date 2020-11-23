import { Component, OnInit } from '@angular/core';
import { CacheService } from '../../../services/cache.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  organization: any;
  constructor(private cacheService: CacheService) {
  }

  ngOnInit() {
    this.organization = this.cacheService.organizationDetail;
  }
}

