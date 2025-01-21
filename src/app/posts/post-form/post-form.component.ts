import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms'
import { Post } from '../../interfaces/post.interface';
import { LucideAngularModule, Pencil } from 'lucide-angular';

@Component({
  selector: 'app-post-form',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './post-form.component.html',
})

export class PostFormComponent implements OnInit {
  readonly Pencil = Pencil

  @Output() submitPost = new EventEmitter<{ title: string; body: string }>()

  @Input() isNewPost = true;
  @Input() post: Post | undefined;

  createPostForm!: FormGroup
  editPostForm!: FormGroup

  isModalOpen = false

  constructor() {
    this.createPostForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
    })
    
    this.editPostForm = new FormGroup({
      title: new FormControl(this.post?.title, [Validators.required]),
      body: new FormControl(this.post?.body, [Validators.required]),
    })
  }

  ngOnInit() {
    if (this.post) {
      this.editPostForm.patchValue({
        title: this.post.title,
        body: this.post.body,
      });
    }
  }

  handleOpenEditModal() {
    this.isModalOpen = true
  }

  handleSubmit() {
    if (this.isNewPost ? this.createPostForm.valid : this.editPostForm.valid) {
      this.submitPost.emit(
        this.isNewPost ? this.createPostForm.value : this.editPostForm.value
      )

      this.createPostForm.reset()
    }
  }
}
