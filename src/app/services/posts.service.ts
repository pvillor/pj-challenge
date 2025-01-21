import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private url = 'https://jsonplaceholder.typicode.com/posts'

  constructor(private http: HttpClient) { }

  createPost({ title, body }: { title: string, body: string}): Observable<Post> {
    return this.http.post<Post>(`${this.url}`, { title, body })
  }

  fetchPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.url}`)
  }

  updatePost({ title, body }: { title: string, body: string}): Observable<Post> {
    // botei id mockado para não dar conflito quando fosse com um id não existente na api, simulando a requisição efetivamente
    
    return this.http.put<Post>(`${this.url}/${1}`, { title, body });
  }

  deletePost(id: number): Observable<void> {
    // botei id mockado para não dar conflito quando fosse com um id não existente na api, simulando a requisição efetivamente

    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
