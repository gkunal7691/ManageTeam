import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-complete-todo-task',
  templateUrl: './complete-todo-task.component.html',
  styleUrls: ['./complete-todo-task.component.scss']
})

export class CompleteTodoTaskComponent implements OnInit {
  completeTask: any;
  no_itemscompleted: boolean = true;
  selectAdminId: any;
  todo: any = {};
  title: boolean = false;
  editingTodo = false;

  constructor(private todoService: TodoService, private route: ActivatedRoute, private router: Router) {
    this.selectAdminId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.getCompleteTodoList();
  }

  getCompleteTodoList() {
    this.todoService.allCompleteTodoList({ userId: this.selectAdminId }).subscribe(
      (res: any) => {
        this.completeTask = res.data;
        if (this.completeTask.rows.length != 0) {
          this.no_itemscompleted = false;
        } else {
          this.no_itemscompleted = true;
        }
      })
  }

  removeTodo(index, $event) {
    this.todoService.deleteTodo({ todoId: this.completeTask.rows[index].todoId }).subscribe(
      (res: any) => {
        //    this.router.navigateByUrl('/employee/todo');
        this.getCompleteTodoList();
      })
  }

  completeTodo(index, $event) {
    this.todoService.completeTodo({ todoId: this.completeTask.rows[index].todoId, complete: $event, userId: this.selectAdminId }).subscribe(
      (res: any) => {
        this.router.navigateByUrl('/employee/todo/' + this.selectAdminId);
      })
  }
  
}
