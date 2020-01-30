import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { UserService } from '../../../services/user.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ForgotPasswordService } from '../../../services/forgot-password.service';
declare var swal: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  currentUser: any;
  resetPasswordForm: FormGroup;
  token: string;

  constructor(private loginService: LoginService, private resetPassword: ForgotPasswordService,
    public userService: UserService, private fb: FormBuilder, private route: ActivatedRoute, ) {
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
    this.userService.getSingleUser(this.loginService.currentUser.id).subscribe((result: any) => {
      if (result.data) {
        this.currentUser = result.data;
      }
    });
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
