import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LeaveRequestService } from '../../../services/leave-request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ViewLeaveDetailsComponent } from '../view-leave-details/view-leave-details.component';
declare var swal: any;

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})

export class LeaveRequestComponent implements OnInit {
  leaveRequestAdminForm: FormGroup;
  public leaveRequestList: any[] = [];
  pendingLeave: boolean;
  approvedLeave: boolean;
  rejectedLeave: boolean;
  cancelledLeave: boolean;
  addedLeave: boolean;
  allLeave: boolean;
  windowWidth: any;
  from: string;
  to: string;
  days: any;

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  @ViewChild(ViewLeaveDetailsComponent, { static: true }) viewLeaveDetail: ViewLeaveDetailsComponent;
  displayedColumns: string[] = ["employee", "fromDate", "toDate", "noOfdays", "type", "reason", "status", "createdAt", "choose_response"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private leaveRequestService: LeaveRequestService,
    private fb: FormBuilder, private router: Router) { }

  ngAfterViewChecked() {
    this.onResize();
  }

  ngOnInit() {
    this.leaveRequestAdminForm = this.fb.group({
      totalDays: [''],
      type: [''],
      reason: ['']
    })
    this.pendingLeave = true;
    this.approvedLeave = false;
    this.rejectedLeave = false;
    this.addedLeave = false;
    this.allLeave = false;
    this.cancelledLeave = false;
    this.filterRequestLeave();

  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  pending(value) {
    this.pendingLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  approve(value) {
    this.approvedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  reject(value) {
    this.rejectedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  add(value) {
    this.addedLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  cancel(value) {
    this.cancelledLeave = value
    this.allLeave = false
    this.filterRequestLeave()
  }

  all(value) {
    this.allLeave = value
    this.approvedLeave = value
    this.cancelledLeave = value
    this.addedLeave = value
    this.rejectedLeave = value
    this.filterRequestLeave()
  }

  filterRequestLeave() {
    let status = {}
    status['ispending'] = this.pendingLeave;
    status['isapprove'] = this.approvedLeave;
    status['isreject'] = this.rejectedLeave;
    status['isadd'] = this.addedLeave;
    status['iscancel'] = this.cancelledLeave;
    console.log(status)

    this.leaveRequestService.getLeaveRequestList(status).subscribe(
      (res: any) => {
        console.log(res.data);
        this.leaveRequestList = res.data;
        this.dataSource = new MatTableDataSource(this.leaveRequestList)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  // Approve leave Sweet Alert

  approvedSweetAlert(leaveRequest) {
    console.log(leaveRequest.leaveId);
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
        this.approvedPopUp(leaveRequest);
      } else {
        swal('Cancelled', 'Leave is not granted for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'error');
      }
    });
  }

  approvedPopUp(leaveRequest) {
    this.leaveRequestService.updateLeaveStatus({ leaveId: leaveRequest.leaveId, status: 'approved' }).subscribe(
      (res: any) => {
        console.log(res);
        swal('Success', 'Leave request approved for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'success');
        this.filterRequestLeave();
      })
  }

  //Reject leave Sweet Alert

  rejectedSweetAlert(leaveRequest) {
    console.log(leaveRequest.leaveId);
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
        console.log(res);
        swal('Rejected', 'Leave request rejected for ' + this.days + ' days(' + this.from + " - " + this.to + ')', 'warning');
        this.filterRequestLeave();
      })
  };

  onViewLeaveDetails(leaveRequest) {
    this.viewLeaveDetail.getSingleLeaveData(leaveRequest);
  }

  getUpdatedLeave(leave) {
    this.filterRequestLeave();
  }

}
