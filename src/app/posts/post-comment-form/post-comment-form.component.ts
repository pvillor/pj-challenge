import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { Comment } from '../../interfaces/comment.interface';
import { LucideAngularModule, Pencil, X as XIcon } from 'lucide-angular';

@Component({
  selector: 'app-comment-form',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './post-comment-form.component.html',
})

export class CommentFormComponent implements OnInit {
  readonly Pencil = Pencil
  readonly X = XIcon

  @Output() submitComment = new EventEmitter<{ body: string }>()

  @Input() isNewComment = true;
  @Input() comment: Comment | undefined;

  createCommentForm!: FormGroup
  editCommentForm!: FormGroup

  isModalOpen = false

  constructor() {
    this.createCommentForm = new FormGroup({
      body: new FormControl('', [Validators.required]),
    })
    
    this.editCommentForm = new FormGroup({
      body: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    if (this.comment) {
      this.editCommentForm.patchValue({
        body: this.comment.body,
      });
    }
  }

  handleOpenEditModal() {
    this.isModalOpen = true
  }

  handleCloseEditModal() {
    this.isModalOpen = false
  }

  handleSubmit() {
    if (this.isNewComment ? this.createCommentForm.valid : this.editCommentForm.valid) {
      this.submitComment.emit(
        this.isNewComment ? this.createCommentForm.value : this.editCommentForm.value
      )

      this.createCommentForm.reset()
    }
  }
}
