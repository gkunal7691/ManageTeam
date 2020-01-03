import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

const routes: Routes = [
  { path: '', component: LoginComponent, },
  { path: 'registration', component: RegistrationComponent, },
  { path: 'forgotpassword', component: ForgotpasswordComponent, },
  { path: 'resetpassword/:id', component: ResetpasswordComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
