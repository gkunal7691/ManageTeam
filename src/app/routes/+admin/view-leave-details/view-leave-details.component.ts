import { Component, OnInit, Input } from '@angular/core';
import { ManageLeaveService } from '../../../services/manage-leave.service';

@Component({
  selector: 'app-view-leave-details',
  templateUrl: './view-leave-details.component.html',
  styleUrls: ['./view-leave-details.component.scss']
})

export class ViewLeaveDetailsComponent implements OnInit {

  leaveData: any;
  leaveRequest: any;
  constructor(private manageLeaveService: ManageLeaveService) { }

  ngOnInit() {
  }

  getSingleLeaveData(leaveRequest) {
    console.log(leaveRequest);
    this.leaveRequest = leaveRequest;
    this.manageLeaveService.getSingleLeaveData(leaveRequest.userId).subscribe(
      (res: any) => {
        this.leaveData = res.data;
        console.log(this.leaveData);
      })
  }

}
