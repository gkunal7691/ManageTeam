import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CacheService } from '../../services/cache.service';


@Injectable()
export class OrgLoadService {

    private route: string;
    private apiPath: string;
    public domain: string;

    constructor(private cacheService: CacheService, private injector: Injector,
        private httpClient: HttpClient, @Inject(DOCUMENT) private document: any) {
        const env: any = environment;
        this.apiPath = env.paths.api;
        if ((location.protocol === 'http:') && (environment.production)) {
            window.location.href = location.href.replace('http', 'https');
        }
    }


    getOrgDetailsbyAPI() {

        const env: any = environment;
        this.apiPath = env.paths.api;
        this.route = 'organization';
        if (env.production) {
            this.domain = this.document.location.hostname;
        } else {
            this.domain = env.paths.ui;
        }

        return new Promise((resolve, reject) => {
            this.httpClient.get<any>(`${this.apiPath}/${this.route}/` + this.domain).subscribe(res => {
                    this.cacheService.setOrgDetails(res.data);
                    resolve(true);
                }),
                (err) => {
                    resolve(false);
                }
        })

    }
}