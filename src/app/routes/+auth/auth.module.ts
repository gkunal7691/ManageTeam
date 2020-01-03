import { NgModule, APP_INITIALIZER} from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ForgotPasswordService } from '../../services';
import { LoginService, AccountService } from '../../services';

import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';


@NgModule({
    declarations: [
        RegistrationComponent,
        ForgotpasswordComponent,
        ResetpasswordComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        DatepickerModule.forRoot() 
        
    ],
    providers: [
      LoginService,
      ForgotPasswordService,
      AccountService,
    ],
})
export class AuthModule {
}
