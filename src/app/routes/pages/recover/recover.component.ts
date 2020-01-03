import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ForgotPasswordService, CacheService } from '../../../services';

@Component({
    selector: 'app-recover',
    templateUrl: './recover.component.html',
    styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements OnInit {

    valForm: FormGroup;
    emailSent:boolean=false;
    emailNotFound:boolean=false;

    constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        private cacheService: CacheService,
        private forgotPasswordService: ForgotPasswordService) {
        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])]
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            console.log('Valid!');
            console.log(value);

            this.sendEmail(value.email) 

        }
    }

    ngOnInit() {
    }


    sendEmail(email:string) {

       
            this.forgotPasswordService.sendEmail(email,this.cacheService.getOrgDetails().organizationId)
            .subscribe((result: any) => {
              if (result.success) {
                this.emailSent=true;
              } else {
                this.emailNotFound=true;
              }
            });
        }
}


