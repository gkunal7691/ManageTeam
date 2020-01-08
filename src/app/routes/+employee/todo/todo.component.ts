import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../../services';
import { EmployeeService } from '../../../services/employee.service';
const swal = require('sweetalert');

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit {
  items: any;
  completeTask: any;
  notComplateTask: any;
  editingTodo = false;
  no_items: boolean = true;
  no_itemscompleted: boolean = true;
  todo: any = {};
  title: boolean = false;
  adminList: any;
  currentUserId: any;
  selectAdminId;

  constructor(private todoService: TodoService, private loginservice: LoginService,private employeeService:EmployeeService,
    private route: ActivatedRoute) {
    this.currentUserId = this.loginservice.currentUser.id;
    this.selectAdminId = this.loginservice.currentUser.id;

    if (this.route.snapshot.params.id != undefined) {
      this.selectAdminId = this.route.snapshot.params.id;
      this.currentUserId = this.route.snapshot.params.id;
    }
  }

  ngOnInit() {
    this.getCompleteTodoList();
    this.getIncompleteTodoList();
    this.getAdminList();
  }

  favTask(star, todoId) {
    this.todoService.updateStar({ star: !star, todoId: todoId, userId: this.selectAdminId }).subscribe(
      (res: any) => {
        this.getIncompleteTodoList();
      })
  }

  emptyForm() {
    if (!this.editingTodo) {
      this.todo.title = '';
      this.todo.description = '';
    }
  }

  getAdminList() {
    this.employeeService.getEmployeeList().subscribe(
      (res: any) => {
        this.adminList = res.data;
      })
  }

  addTodo() {
    if (this.editingTodo) {
      this.todoService.updateTodo({ todoId: this.todo.todoId, title: this.todo.title, description: this.todo.description, userId: this.selectAdminId }).subscribe(
        (res: any) => {
          console.log(res);
          swal('Success', 'Todo(' +this.todo.title+ ') is updated :)', 'success');
          this.todo.title = '';
          this.todo.description = '';
          this.editingTodo = false;
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
          document.getElementById("closeTodoModal").click();
        })
    } else {
      this.todoService.addTodo({ title: this.todo.title, description: this.todo.description, complete: false }).subscribe(
        (res: any) => {
          console.log(res);
          swal('Success', 'Todo(' +this.todo.title+ ') is added :)', 'success');
          this.todo.title = '';
          this.todo.description = '';
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
          document.getElementById("closeTodoModal").click();
        })
    }
  }

  getCompleteTodoList() {
    this.todoService.completeTodoList({ userId: this.selectAdminId }).subscribe(
      (res: any) => {
        console.log(res)
        this.completeTask = res.data;
        console.log(this.completeTask)
        if (this.completeTask.rows.length != 0) {
          this.no_itemscompleted = false;
        } else {
          this.no_itemscompleted = true;
        }
      })
  }

  getIncompleteTodoList() {
    console.log(this.selectAdminId)
    this.todoService.incompleteTodoList({ userId: this.selectAdminId }).subscribe(
      (res: any) => {
        console.log(res)
        this.notComplateTask = res.data;
        if (this.notComplateTask.length != 0) {
          this.no_items = false;
        } else {
          this.no_items = true;
        }
      })
  }

  selectAdminTodo(userId) {
    this.selectAdminId = userId;
    this.getCompleteTodoList();
    this.getIncompleteTodoList();
  }

  editTodo(index, $event) {
    $event.preventDefault();
    $event.stopPropagation();
    this.todo = this.notComplateTask[index];
    this.editingTodo = true;
    document.getElementById("openTodoModal").click();
  };

  removeTodo(index, $event, value) {
    if (value == 'notComplete') {
      this.todoService.deleteTodo({ todoId: this.notComplateTask[index].todoId }).subscribe(
        (res: any) => {
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
        })
    }

    if (value == 'complete') {
      this.todoService.deleteTodo({ todoId: this.completeTask.rows[index].todoId }).subscribe(
        (res: any) => {
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
        })
    }
  };

  completeTodo(index, $event, value) {
    console.log(index, $event)
    if (value == 'notComplete') {
      this.todoService.completeTodo({ todoId: this.notComplateTask[index].todoId, complete: $event, userId: this.selectAdminId }).subscribe(
        (res: any) => {
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
        })
    }
    if (value == 'complete') {
      this.todoService.completeTodo({ todoId: this.completeTask.rows[index].todoId, complete: $event, userId: this.selectAdminId }).subscribe(
        (res: any) => {
          this.getCompleteTodoList();
          this.getIncompleteTodoList();
        })
    }
  }

}
