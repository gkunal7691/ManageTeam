import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LeaveRequestService } from '../../../services/leave-request.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ViewLeaveDetailsComponent } from '../view-leave-details/view-leave-details.component';
const swal = require('sweetalert');

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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.windowWidth = window.innerWidth;
  }

  @ViewChild(ViewLeaveDetailsComponent, { static: true }) viewLeaveDetail :ViewLeaveDetailsComponent;
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

  // Approved Sweet Alert 
  approvedSweetAlert(leaveId) {
    swal({
      title: "Are you sure?",
      text: "Leave will be approved to the employee!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willAprrove) => {
      if (willAprrove) {
        this.approvedPopUp(leaveId);
      } else {
        swal('Cancelled', 'Leave is not granted :)', 'error');
      }
    });
  }

  approvedPopUp(leaveId) {
    console.log(leaveId);
    this.leaveRequestService.updateLeaveStatus({ leaveId: leaveId, status: 'approved' }).subscribe(
      (res: any) => {
        console.log(res);
        swal('Success', 'Leave request approved! :)', 'success');
        this.filterRequestLeave();
      })
  }

  //Rejected Sweet Alert 
  rejectedSweetAlert(leaveId) {
    swal({
      title: "Are you sure?",
      text: "Leave will be rejected for the employee!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willReject) => {
      if (willReject) {
        this.rejectedPopUp(leaveId);
      } else {
        swal('Cancelled', 'Leave is not rejected :)', 'error');
      }
    });
  }

  rejectedPopUp(leaveId) {
    this.leaveRequestService.updateLeaveStatus({ leaveId: leaveId, status: 'rejected' }).subscribe(
      (res: any) => {
        console.log(res)
        swal('Rejected', 'Leave request rejected! :)', 'warning');
        this.filterRequestLeave();
      })
  };

  onViewLeaveDetails(leaveRequest) {
    this.viewLeaveDetail.getSingleLeaveData(leaveRequest);
  }

}
