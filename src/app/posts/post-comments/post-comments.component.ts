import { Component, Input, OnInit } from '@angular/core'
import { CommentsService } from '../../services/comments.service'
import { Post } from '../../interfaces/post.interface'
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular'
import { CommentFormComponent } from "../post-comment-form/post-comment-form.component"
import { Comment } from '../../interfaces/comment.interface'

@Component({
  selector: 'app-post-comments',
  imports: [
    LucideAngularModule,
    CommentFormComponent
],
  templateUrl: './post-comments.component.html'
})
export class CommentsComponent implements OnInit {
  @Input() post: Post | undefined

  comments: Comment[] = []

  readonly PencilIcon = Pencil
  readonly TrashIcon = Trash2

  readonly name = 'John Doe'
  readonly email = 'john.doe@example.com'

  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    const storedComments = localStorage.getItem('@pj-comments')

    if (storedComments) {
      this.comments = JSON.parse(storedComments)
    } else {
      this.commentsService.fetchComments().subscribe((data: Comment[]) => {
        this.comments = data
        localStorage.setItem('@pj-comments', JSON.stringify(this.comments))
      })
    }
  }

  handleCreateComment({ body }: { body: string }) {
    const storedComments: Comment[] = JSON.parse(localStorage.getItem('@pj-comments') || '[]')
    
    if (this.post) {
      let nextId = storedComments.length > 0 
          ? Math.max(...storedComments.map(comment => comment.id)) + 1 
          : 1
          
      this.commentsService.createComment({ name: this.name, email: this.email, body }).subscribe((comment) => {
        const newComment = { ...comment, id: nextId, postId: this.post!.id }
        
        if (!this.post!.comments) {
          this.post!.comments = []
        }
  
        this.comments.unshift(newComment)
        this.post!.comments.unshift(newComment)
  
        localStorage.setItem('@pj-comments', JSON.stringify([ ...storedComments, newComment ]))
        this.updateLocalStorage()
      })
    }
  }  

  handleUpdateComment(commentId: number, { body }: { body: string }) {
    if (this.post) {
      const commentToUpdate = this.post.comments?.find(comment => comment.id === commentId)

      if(!commentToUpdate || !this.post.comments) {
        return
      }

      this.commentsService.updateComment({ name: this.name, email: this.email, body }).subscribe((updatedComment) => {
        const index = this.post!.comments!.findIndex(comment => comment.id === commentId)

        if(!this.post?.comments) {
          return
        }
        
        if (index !== -1) {
          this.post.comments[index] = { ...updatedComment, id: commentId, postId: this.post.id }
          this.updateLocalStorage()
        }
      })
    }
  }

  handleDeleteComment(commentId: number) {
    if (this.post) {
      this.commentsService.deleteComment().subscribe(() => {
        this.post!.comments = this.post!.comments?.filter(comment => comment.id !== commentId)
        this.updateLocalStorage()
      })
    }
  }

  private updateLocalStorage() {
    const storedPosts = localStorage.getItem('@pj-posts')

    if(!storedPosts) {
      return
    }
    
    const posts = JSON.parse(storedPosts)
    const index = posts.findIndex((post: Post) => post.id === this.post?.id)

    if (index !== -1) {
      posts[index] = this.post
      localStorage.setItem('@pj-posts', JSON.stringify(posts))
    }
  }
}
