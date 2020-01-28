import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentService } from '../../../../services/comment.service';
declare var swal: any;

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit {

  constructor(private fb: FormBuilder, private commentService: CommentService) { }

  commentForm: FormGroup;
  @Input() taskId: any;
  @Output() updateTask = new EventEmitter();

  ngOnInit() {
    this.commentForm = this.fb.group({
      'comment': ['', [Validators.maxLength(5000)]]
    })
  }

  addComment() {
    console.log(this.commentForm.value)
    this.commentService.addComment({ comment: this.commentForm.get('comment').value, taskId: this.taskId }).subscribe((res: any) => {
      if (res.data) {
        swal('Success', 'Comment is added :)', 'success');
      }
      this.updateTask.emit();
      this.cancelComment();
    })
    this.commentForm.reset();
  }

  cancelComment() {
    var x = document.getElementById("testing");
    setTimeout(() => { x.classList.add("modal-open") }, 120);
  }

}
