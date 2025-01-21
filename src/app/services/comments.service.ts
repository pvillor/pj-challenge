import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private url = 'https://jsonplaceholder.typicode.com/comments'

  constructor(private http: HttpClient) {}

  createComment({ name, email, body }: { name: string,  email: string, body: string }): Observable<Comment> {
    return this.http.post<Comment>(`${this.url}`, { name, email, body })
  }

  fetchComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}`)
  }

  fetchCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.url}?postId=${postId}`)
  }

  updateComment({ name, email, body }: { name: string,  email: string, body: string }): Observable<Comment> {
    // botei id mockado para não dar conflito quando fosse com um id não existente na api, simulando a requisição efetivamente

    return this.http.put<Comment>(`${this.url}/${1}`, { name, email, body });
  }

  deleteComment(): Observable<void> {
    // botei id mockado para não dar conflito quando fosse com um id não existente na api, simulando a requisição efetivamente

    return this.http.delete<void>(`${this.url}/${1}`);
  }
}
