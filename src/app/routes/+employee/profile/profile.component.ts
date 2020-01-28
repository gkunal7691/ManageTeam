import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ForgotPasswordService } from '../../../services/forgot-password.service';
import { ActivatedRoute } from '@angular/router';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  currentUser: any;
  userDeatils: any;
  resetPasswordForm: FormGroup;
  token: string;

  constructor(private loginService: LoginService, private fb: FormBuilder, private route: ActivatedRoute,
    private superAdminService: SuperAdminService, private resetPassword: ForgotPasswordService) {
    this.token = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.resetPasswordForm = this.fb.group({
      newPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
      conformNewPassword: new FormControl("", [Validators.required, Validators.minLength(6)])
    },
      { validator: this.checkIfMatchingPasswords('newPassword', 'conformNewPassword') }
    );

    this.getUserDetails();

  }

  getUserDetails() {
    this.currentUser = this.loginService.currentUser;
    this.superAdminService.getUserInfo(this.currentUser.id).subscribe((res: any) => {
      this.userDeatils = res.data;
    })
  }

  resetForm() {
    this.resetPasswordForm.reset();
  }

  checkIfMatchingPasswords(newPasswordKey: string, ConformNewPasswordKey: string) {
    return (group: FormGroup) => {
      const passwordInput = group.controls[newPasswordKey];
      const passwordConfirmationInput = group.controls[ConformNewPasswordKey];

      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notSamePassword: true });
      } else {
        return passwordConfirmationInput.setErrors(null);
      }
    };
  }

  setResetPassword() {
    this.resetPassword.resetPassword({ password: this.resetPasswordForm.get('newPassword').value }).subscribe(
      (result: any) => {
        if (result.success) {
          this.resetForm();
          swal('Success', 'Password reset successful :)', 'success');
        } else {
          swal('Error', 'Password reset unsuccessful', 'error');
        }
      })
  }

}
