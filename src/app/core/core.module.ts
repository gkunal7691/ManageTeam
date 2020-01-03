import { HttpClient } from '@angular/common/http';
import { APP_INITIALIZER, Inject, NgModule, Optional, SkipSelf } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../environments/environment';
import { CacheService, LoginService } from '../services';
import { MenuService } from './menu/menu.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { LoadService } from './org/load.service';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';


declare var $: any;

export function usersProviderFactory(provider: LoadService) {
    return () => provider.setUserbyAPI();
}

@NgModule({
    imports: [
    ],
    providers: [
        SettingsService,
        ThemesService,
        TranslatorService,
        MenuService,
        LoadService,
        { provide: APP_INITIALIZER, useFactory: usersProviderFactory, deps: [LoadService], multi: true },
        LoginService
    ],
    declarations: [
    ],
    exports: [
    ]
})
export class CoreModule {

    private apiPath: string;
    private route: string;
    public domain: string;


    constructor(@Optional() @SkipSelf() parentModule: CoreModule, @Inject(DOCUMENT) private document: any,
        private cacheService: CacheService,
        private http: HttpClient) {
        const env: any = environment;
        this.apiPath = env.paths.api;
        this.route = 'organization';
        $(document).on('click', '[href="#"]', e => e.preventDefault());
        this.domain = this.document.location.hostname;
        this.http.get<any>(`${this.apiPath}/${this.route}/` + this.domain).subscribe(
            res => {
                this.cacheService.setOrgDetails(res.data);
            })

        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
