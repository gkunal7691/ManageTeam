import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AccordionModule, AccordionConfig } from 'ngx-bootstrap/accordion';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { LoginService} from './services';
import { AuthGuard} from './services';
import { RegistrationService} from './services';
import { CacheService} from './services';
import { AccountService} from './services';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule, // required for ng2-tag-input
        HttpClientModule,
        CoreModule,
        AccordionModule.forRoot(),
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        CacheService,
        AuthGuard,
        LoginService,
        AccountService,
        RegistrationService,
        { provide: AccordionConfig, useValue: { closeOthers: true } },

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
