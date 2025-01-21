import { Component, OnInit, ViewChild } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../interfaces/post.interface';
import { LucideAngularModule, Trash2 } from 'lucide-angular';
import { CommentsComponent } from '../post-comments/post-comments.component';
import { CommentsService } from '../../services/comments.service';
import { Comment } from '../../interfaces/comment.interface';
import { PostFormComponent } from '../post-form/post-form.component';

@Component({
  selector: 'app-post-list',
  imports: [
    LucideAngularModule,
    CommentsComponent,
    PostFormComponent
  ],
  templateUrl: './post-list.component.html',
  providers: [
    PostsService
  ]
})
export class PostListComponent implements OnInit {
  constructor(
    private postsService: PostsService,
    private commentsService: CommentsService
  ) {}

  posts: Post[] = []
  
  readonly author = 'John Doe'
  readonly authorEmail = 'john.doe@example.com'

  readonly Trash = Trash2

  ngOnInit(): void {
    const storedPosts = localStorage.getItem('@pj-posts')

    if (storedPosts) {
      this.posts = JSON.parse(storedPosts)
    } else {
      this.postsService.fetchPosts().subscribe((data: Post[]) => {
        const postsSortedById = data.sort((a, b) => b.id - a.id)

        postsSortedById.map(post => {
          this.commentsService.fetchCommentsByPostId(post.id).subscribe(comments => {
            const postWithComments = { ...post, comments }
            this.posts.push(postWithComments)

            localStorage.setItem('@pj-posts', JSON.stringify(this.posts))
          })
        })
      })
    }
  }

  handleCreatePost({ title, body }: { title: string, body: string}) {
    const nextId = Math.max(...this.posts.map(post => post.id)) + 1
    
    this.postsService.createPost({ title, body }).subscribe((post) => {
      this.posts.unshift({ ...post, id: nextId})
      localStorage.setItem('@pj-posts', JSON.stringify(this.posts))
    })
  }

  handleUpdatePost(id: number, { title, body }: { title: string, body: string}) {
    const postToUpdate = this.posts.find(post => post.id === id)

    let comments: Comment[] = []

    if(postToUpdate) {
      postToUpdate.comments?.forEach(comment => comments.push(comment))
    }
    
    this.postsService.updatePost({ title, body }).subscribe((post) => {
      const index = this.posts.findIndex(post => post.id === id)

      if (index !== -1) {
        this.posts[index] = { ...post, id, comments }
        localStorage.setItem('@pj-posts', JSON.stringify(this.posts))
      }
    })
  }

  handleDeletePost(id: number) {
    this.postsService.deletePost(id).subscribe((_) => {
      this.posts = this.posts.filter(post => post.id !== id)
      localStorage.setItem('@pj-posts', JSON.stringify(this.posts))
    })
  }
}
