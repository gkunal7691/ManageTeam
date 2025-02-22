import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { SuperAdminService } from '../../../services/super-admin.service';
import { EmployeeService } from '../../../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { CustomValidators } from 'ng2-validation';
import { Router } from '@angular/router';
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
  modalTitle: string;
  selectedUserId: number;

  displayedColumns: string[] = ["id", "user", "roleId", "lastLogin", "action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private superAdminService: SuperAdminService, private fb: FormBuilder,
    private loginservice: LoginService, private EmployeeService: EmployeeService, private router: Router) {
    this.allAdminList = 'user';
    this.userList = 'user';
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
      mobile: ['', [Validators.pattern('^[0-9]+$'), Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      bank: '',
      banknumber: '',
      doj: ['', [Validators.required]],
      pf: '',
      dept: ['', [Validators.required]],
      location: ['', [Validators.required]]
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
      tempAddress: this.addUserInfoForm.get('tempAddress').value, permanentAddress: this.addUserInfoForm.get('permanentAddress').value,
      mobile: this.addUserInfoForm.get('mobile').value, bank: this.addUserInfoForm.get('bank').value,
      bankAccountNo: this.addUserInfoForm.get('banknumber').value, doj: this.addUserInfoForm.get('doj').value,
      pfNumber: this.addUserInfoForm.get('pf').value, department: this.addUserInfoForm.get('dept').value,
      location: this.addUserInfoForm.get('location').value, userId: this.userId
    }).subscribe(
      (res: any) => {
        swal('Success', 'User(' + this.addUserForm.get('firstName').value + ' ' +
          this.addUserForm.get('lastName').value + ') is added to the organization successfully :)', 'success');
        this.formReset();
        this.getUserList();
        this.getAdminList();
      })
  }

  deleteAdmin(value) {
    this.superAdminService.deleteClient(value).subscribe(
      (res: any) => {
        this.getAdminList();
      })
  }

  getUserList() {
    this.superAdminService.getUserList().subscribe(
      (res: any) => {
        res.data.forEach(user => {
          if (user.roleId == 1) {
            user.roleId = 'Employee';
          }
          else if (user.roleId == 2) {
            user.roleId = 'Admin/Manager';
          }
          else if (user.roleId == 3) {
            user.roleId = 'Super Admin';
          }
        })
        this.userList = res.data;
        this.dataSource = new MatTableDataSource(this.userList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  getAdminList() {
    this.EmployeeService.getAllAdminList().subscribe(
      (res: any) => {
        this.allAdminList = res.data;
      })
  }

  updateFormForEdit(employeeList) {
    this.selectedUserId = employeeList.id;
    this.modalTitle = "Edit User Information";
    this.addUserForm.get('firstName').setValue(employeeList.firstName);
    this.addUserForm.get('lastName').setValue(employeeList.lastName);
    this.addUserForm.get('roleId').setValue(1);

    this.addUserInfoForm.get('desg').setValue(employeeList.userInfo.designation);
    this.addUserForm.get('email').setValue(employeeList.email);
    this.addUserInfoForm.get('secEmail').setValue(employeeList.userInfo.secondaryEmail);
    this.addUserInfoForm.get('tempAddress').setValue(employeeList.userInfo.tempAddress);
    this.addUserInfoForm.get('mobile').setValue(employeeList.userInfo.mobile);
    this.addUserInfoForm.get('bank').setValue(employeeList.userInfo.bank);
    this.addUserInfoForm.get('banknumber').setValue(employeeList.userInfo.bankAccountNo);
    this.addUserInfoForm.get('doj').setValue(employeeList.userInfo.doj);
    this.addUserInfoForm.get('pf').setValue(employeeList.userInfo.pfNumber);
    this.addUserInfoForm.get('location').setValue(employeeList.userInfo.location);
    this.addUserInfoForm.get('dept').setValue(employeeList.userInfo.department);
    this.addUserInfoForm.get('permanentAddress').setValue(employeeList.userInfo.permanentAddress);
  }

  updateUserData() {
    console.log('save')
    this.superAdminService.updateUserData({
      firstName: this.addUserForm.get('firstName').value, lastName: this.addUserForm.get('lastName').value,
      email: this.addUserForm.get('email').value, roleId: this.addUserForm.get('roleId').value, id: this.selectedUserId,
      desg: this.addUserInfoForm.get('desg').value, secEmail: this.addUserInfoForm.get('secEmail').value,
      tempAddress: this.addUserInfoForm.get('tempAddress').value, mobile: this.addUserInfoForm.get('mobile').value,
      permanentAddress: this.addUserInfoForm.get('permanentAddress').value, doj: this.addUserInfoForm.get('doj').value,
      bankAccountNo: this.addUserInfoForm.get('banknumber').value, pfNumber: this.addUserInfoForm.get('pf').value,
      location: this.addUserInfoForm.get('location').value, dept: this.addUserInfoForm.get('dept').value,
      bank: this.addUserInfoForm.get('bank').value
    }).subscribe((res: any) => {
      this.getUserList();
    })
  }

  onViewClick(employeeList) {
    console.log(employeeList);
    if (employeeList.roleId == 'Employee') {
      this.router.navigateByUrl('/systemadmin/ManagePayslip/' + employeeList.id);
    }
  }

  deleteUser(id) {
    this.superAdminService.deleteUserData(id).subscribe(
      (res: any) => {
        this.getUserList();
      })
    // let user = this.userList.map(employee => { return employee.id }).indexOf(id)
    // let newUSerLIst = this.userList.splice(user, 1)
    // console.log(this.userList)
    // this.getUserList()

  }


  formReset() {
    this.modalTitle = "Add New User";
    this.addUserForm.reset();
    this.addUserInfoForm.reset();
    this.addUserForm.get('roleId').setValue('');
    this.addUserInfoForm.get('desg').setValue('');
    this.addUserForm.get('email').setValue('');
    this.addUserInfoForm.get('secEmail').setValue('');
    this.addUserForm.get('password').setValue('');
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }
}