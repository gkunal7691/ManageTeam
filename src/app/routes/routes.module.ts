import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrgLoadService } from '../core/load/org.service';
import { MenuService } from '../core/menu/menu.service';
import { TranslatorService } from '../core/translator/translator.service';
import { SharedModule } from '../shared/shared.module';
import { menu } from './menu';
import { routes } from './routes';

export function orgProviderFactory(provider: OrgLoadService) {
    return () => provider.getOrgDetailsbyAPI();
}

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [],
    exports: [
        RouterModule
    ],
    providers: [
        OrgLoadService,
        { provide: APP_INITIALIZER, useFactory: orgProviderFactory, deps: [OrgLoadService], multi: true }
    ]
})

export class RoutesModule {
    constructor(public menuService: MenuService, tr: TranslatorService) {
        menuService.addMenu(menu);
    }
}
