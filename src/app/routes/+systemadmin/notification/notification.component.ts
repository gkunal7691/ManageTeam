import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {


  selectedValue: any;
  
  constructor(private superAdminService: SuperAdminService, private fb: FormBuilder, ) { }



  ngOnInit() {

    this.getNotification();
  }

  selectMailNotification(value) {
    console.log(value)

   
    this.superAdminService.setNotication({ mail_Notification: value }).subscribe(
      (res:any) =>{
   console.log(res)
      })
  
}

  getNotification() {
    this.superAdminService.getNotification().subscribe(
      (res: any) => {
        this.selectedValue = res.data.mail_Notification
        console.log(this.selectedValue)

      })
  }

}
