import { Component, OnInit ,ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { EmployeeService } from '../../../services/employee.service';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource} from '@angular/material/table';
import { MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-admin-employee',
  templateUrl: './admin-employee.component.html',
  styleUrls: ['./admin-employee.component.scss']
})

export class AdminEmployeeComponent implements OnInit {
  private apiPath: string;
  private employeeList:any;
  dtTrigger: Subject<any> = new Subject();

  displayedColumns: string[] = ["id","employee","lastLogin","action"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private EmployeeService:EmployeeService) {
    this.employeeList = 'user'
  }

  search(searchValue: string) {
    this.dataSource.filter = searchValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.getEmployeeList();
    this.dtTrigger.next();

  }

  getEmployeeList(){
   this.EmployeeService.getEmployeeList().subscribe(
      (res: any) => {
        this.employeeList = res.data;
        this.dataSource = new MatTableDataSource(this.employeeList)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dtTrigger.next();
      })
  }

  onViewClick(value) {
  }

}
