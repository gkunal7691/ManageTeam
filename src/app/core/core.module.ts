import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { LoginService } from '../services/login.service';
import { AuthLoadService } from './load/auth.service';
import { MenuService } from './menu/menu.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { SettingsService } from './settings/settings.service';
import { ThemesService } from './themes/themes.service';
import { TranslatorService } from './translator/translator.service';


export function usersProviderFactory(provider: AuthLoadService) {
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
        AuthLoadService,
        { provide: APP_INITIALIZER, useFactory: usersProviderFactory, deps: [AuthLoadService], multi: true },
        LoginService
    ]
})
export class CoreModule {

    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {

        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
