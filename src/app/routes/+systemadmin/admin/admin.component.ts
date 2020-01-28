import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { EmployeeService } from '../../../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CustomValidators } from 'ng2-validation';
declare var swal: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  addUserForm: FormGroup;
  addUserInfoForm: FormGroup;
  adminList: any[] = [];
  userId: any;
  private allAdminList: any;
  private userList: any;

  displayedColumns: string[] = ["id", "user", "roleId", "lastLogin", "action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private superAdminService: SuperAdminService, private fb: FormBuilder,
    private loginservice: LoginService, private EmployeeService: EmployeeService) {
    this.allAdminList = 'user';
    this.userList = 'user';
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', Validators.compose([Validators.required, CustomValidators.email])],
      password: ['', [Validators.required]],
      roleId: ['', [Validators.required]]
    })

    this.addUserInfoForm = this.fb.group({
      desg: ['', Validators.required],
      secEmail: ['', Validators.compose([Validators.required, CustomValidators.email])],
      tempAddress: ['', [Validators.required, Validators.maxLength(5000)]],
      permanentAddress: ['', [Validators.required, Validators.maxLength(5000)]],
      mobile: ['', [Validators.pattern('^[0-9]+$'), Validators.required, Validators.minLength(10), Validators.maxLength(10)]]
    })
    this.getAdminList();
    this.getUserList();

  }

  createUser() {
    // for addUserForm
    this.superAdminService.addUser({
      firstName: this.addUserForm.get('firstName').value,
      lastName: this.addUserForm.get('lastName').value, email: this.addUserForm.get('email').value,
      password: this.addUserForm.get('password').value, roleId: this.addUserForm.get('roleId').value,
      createdBy: this.loginservice.currentUser.id, organizationId: this.loginservice.currentOrg.organizationId
    }).subscribe(
      (res: any) => {
        this.userId = res.data.id;
        this.createUserInfo();
      })
  }

  createUserInfo() {
    this.superAdminService.addUserInfo({
      designation: this.addUserInfoForm.get('desg').value, secondaryEmail: this.addUserInfoForm.get('secEmail').value,
      tempAddress: this.addUserInfoForm.get('tempAddress').value,
      permanentAddress: this.addUserInfoForm.get('permanentAddress').value,
      mobile: this.addUserInfoForm.get('mobile').value, userId: this.userId
    }).subscribe(
      (res: any) => {
        swal('Success', 'User(' +this.addUserForm.get('firstName').value+' '+
          this.addUserForm.get('lastName').value+') is added to the organization successfully :)', 'success');
        this.closeAddUserModal();
        this.getUserList();
        this.getAdminList();
      })
  }

  closeAddUserModal() {
    this.addUserForm.reset();
    this.addUserInfoForm.reset();
  }

  deleteAdmin(value) {
    this.superAdminService.deleteClient(value).subscribe(
      (res: any) => {
        this.getAdminList();
      }
    )
  }

  getUserList() {
    this.superAdminService.getUserList().subscribe(
      (res: any) => {
        res.data.forEach(user => {
          if (user.roleId == 1) {
            user.roleId = 'Employee'
          }
          else if (user.roleId == 2) {
            user.roleId = 'Admin/Manager'
          }
          else if (user.roleId == 3) {
            user.roleId = 'Super Admin'
          }
        })
        this.userList = res.data;
        this.dataSource = new MatTableDataSource(this.userList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    )
  }

  getAdminList() {
    this.EmployeeService.getAllAdminList().subscribe(
      (res: any) => {
        this.allAdminList = res.data;
      })
  }

  onViewClick(value) {
    console.log(value)
  }

}
