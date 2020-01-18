import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CacheService } from '../../../services/cache.service';
import { ForgotPasswordService } from '../../../services/forgot-password.service';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  emailNotFound: boolean = false;
  emailSent: boolean;

  constructor(
    private cacheService: CacheService,
    private fb: FormBuilder,
    private forgotPasswordService: ForgotPasswordService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }


  sendEmail() {

    if (!this.forgotPasswordForm.valid) {
      return;
    } else {
      this.forgotPasswordService.sendEmail(this.forgotPasswordForm.value.email, this.cacheService.getOrgDetails().organizationId)
        .subscribe((result: any) => {
          if (result.success) {
            this.emailSent = true;
          } else {
            this.emailNotFound = true;
          }
        });
    }
  }


}
