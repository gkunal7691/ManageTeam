import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LeaveRequestService } from '../../../services/leave-request.service';
declare var swal: any;

@Component({
  selector: 'app-view-leave-details',
  templateUrl: './view-leave-details.component.html',
  styleUrls: ['./view-leave-details.component.scss']
})

export class ViewLeaveDetailsComponent implements OnInit {
  leaveData: any;
  leaveRequest: any;
  from: any;
  to: any;
  days: any;
  @Output() updatedLeave = new EventEmitter();

  constructor(private leaveRequestService: LeaveRequestService) { }

  ngOnInit() {
  }

  getSingleLeaveData(leaveRequest) {
    this.leaveRequest = leaveRequest;
    this.leaveRequestService.getSingleLeaveData(leaveRequest.userId).subscribe(
      (res: any) => {
        this.leaveData = res.data;
      })
  }

  // Approve leave Sweet Alert

  approvedSweetAlert(leaveRequest) {
    this.from = new Date(leaveRequest.fromDate).getDate() + '/' + (new Date(leaveRequest.fromDate).getMonth() + 1) + '/' +
      (new Date(leaveRequest.fromDate).getFullYear());
    this.to = new Date(leaveRequest.toDate).getDate() + '/' + (new Date(leaveRequest.toDate).getMonth() + 1) + '/' +
      (new Date(leaveRequest.toDate).getFullYear());
    this.days = leaveRequest.noOfdays;
    if (this.days < 0) {
      this.days = this.days * (-1);
    }
    swal({
      title: "Are you sure?",
      text: "Leave will be approved for " + this.days + " days(" + this.from + " - " + this.to + ")",
      icon: "warning",
      dangerMode: true,
    }).then((willAprrove) => {
      if (willAprrove) {
        this.approvedPopUp(leaveRequest.leaveId);
      } else {
        swal('Cancelled', 'Leave is not granted for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'error');
      }
    });
  }

  approvedPopUp(leaveRequest) {
    this.leaveRequestService.updateLeaveStatus({ leaveId: leaveRequest.leaveId, status: 'approved' }).subscribe(
      (res: any) => {
        this.updatedLeave.emit(leaveRequest);
        swal('Success', 'Leave request approved for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'success');
      })
  }

  //Reject leave Sweet Alert 

  rejectedSweetAlert(leaveRequest) {
    this.from = new Date(leaveRequest.fromDate).getDate() + '/' + (new Date(leaveRequest.fromDate).getMonth() + 1) + '/' +
      (new Date(leaveRequest.fromDate).getFullYear());
    this.to = new Date(leaveRequest.toDate).getDate() + '/' + (new Date(leaveRequest.toDate).getMonth() + 1) + '/' +
      (new Date(leaveRequest.toDate).getFullYear());
    this.days = leaveRequest.noOfdays;
    if (this.days < 0) {
      this.days = this.days * (-1);
    }
    swal({
      title: "Are you sure?",
      text: "Leave will be rejected for " + this.days + " days(" + this.from + " - " + this.to + ")",
      icon: "warning",
      dangerMode: true,
    }).then((willReject) => {
      if (willReject) {
        this.rejectedPopUp(leaveRequest);
      } else {
        swal('Cancelled', 'Leave is not rejected for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'error');
      }
    });
  }

  rejectedPopUp(leaveRequest) {
    this.leaveRequestService.updateLeaveStatus({ leaveId: leaveRequest.leaveId, status: 'rejected' }).subscribe(
      (res: any) => {
        this.updatedLeave.emit(leaveRequest);
        swal('Rejected', 'Leave request rejected for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'warning');
      })
  };

}
