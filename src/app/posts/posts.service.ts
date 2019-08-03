import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Content } from '@angular/compiler/src/render3/r3_ast';


@Injectable({ providedIn: "root" })

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPost(id: string) {
    // return { ...this.posts.find(p => { return p.id === id }) };
    return this.http.get<{ _id: string, title: string, content: string }>("http://localhost:3000/api/posts/" + id);

  }

  getPosts() {
    this.http.get<{ message: string, posts: any }>("http://localhost:3000/api/posts")
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });


  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  createPost(title: string, content: string, id: string) {
    const post: Post = { title: title, content: content, id: null };
    this.http.post<{ message: string, postId: string }>("http://localhost:3000/api/posts", post)
      .subscribe(
        (responseData) => {
          const id = responseData.postId;
          post.id = id;
          console.log(responseData.message);
          this.posts.push(post);
          this.postsUpdated.next([...this.posts]);
        }
      );
  }

  updatePosts(title: string, content: string, id: string) {
    const post: Post = { title: title, content: content, id: id };
    this.http.put("http://localhost:3000/api/posts/" + id, post).subscribe(
      (response) => {
        const updatedPosts = [...this.posts];
        const oldpostIndex = updatedPosts.findIndex(p => p.id == post.id);
        updatedPosts[oldpostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

      }
    )
  }

  deletePost(postId: string) {
    this.http.delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id != postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);


      });

  }
}
