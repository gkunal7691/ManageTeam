import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ForgotPasswordService } from '../../../services/forgot-password.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  token:string;
  isPasswordReseted:boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private forgotPasswordService: ForgotPasswordService
  ) { 
    this.token = this.route.snapshot.params.id;
  }

  ngOnInit() {

    this.resetPasswordForm = this.fb.group({
     
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, {validator: this.checkIfMatchingPasswords('password', 'confirmPassword')});
  }

   checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
        return (group: FormGroup) => {
            const passwordInput = group.controls[passwordKey];
            const passwordConfirmationInput = group.controls[passwordConfirmationKey];

            if (passwordInput.value !== passwordConfirmationInput.value) {
                return passwordConfirmationInput.setErrors({notSamePassword: true});
            } else {
                return passwordConfirmationInput.setErrors(null);
            }
        };
    }


    resetPassword(){
      if (!this.resetPasswordForm.valid) {
        return;
    }

    this.forgotPasswordService.resetPassword({
      password: this.resetPasswordForm.value.password,
      token:this.token
    }).subscribe((result: any) => {
      if (result.success) {
        this.resetPasswordForm.reset();
        this.isPasswordReseted=true;

      } else {
        console.log(result);
      }
    });



    }

}
