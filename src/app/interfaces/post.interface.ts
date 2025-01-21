import { Comment } from "./comment.interface";

export interface Post {
  id: number,
  title: string,
  body: string,
  userId: number,
  comments?: Comment[]
}