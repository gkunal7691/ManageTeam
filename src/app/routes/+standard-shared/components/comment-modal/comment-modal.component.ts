import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommentService } from '../../../../services/comment.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit {

  constructor(private fb: FormBuilder,private commentService: CommentService) { }

  commentForm: FormGroup;
  taskId:number;

  ngOnInit() {
    this.commentForm = this.fb.group({
      'comment': ['', [Validators.maxLength(5000)]]
    })
  }

  addComment() {
    this.commentService.addComment({ comment: this.commentForm.get('comment').value, taskId: this.taskId }).subscribe((res: any) => {
      // this.editBtn = true
      // this.cancelComment();
      // this.showTask.emit();
    })
    this.commentForm.reset();
  }

  cancelComment() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 120);
  }

}
