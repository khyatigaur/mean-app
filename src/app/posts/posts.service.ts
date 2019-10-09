import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router'


@Injectable({ providedIn: "root" })

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPost(id: string) {
    // return { ...this.posts.find(p => { return p.id === id }) };
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string; }>("http://localhost:3000/api/posts/" + id);

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>("http://localhost:3000/api/posts" + queryParams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts

          // }
        }
      })
      )
      // }
      .subscribe((transformedPosts) => {
        console.log(transformedPosts.posts)
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPosts.maxPosts
        });
      });


  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  createPost(title: string, content: string, image: File, id: string) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image, title);

    // const post: Post = { title: title, content: content, id: null };
    this.http.post<{ message: string, post: Post }>("http://localhost:3000/api/posts", formData)
      .subscribe(
        (responseData) => {
          // const post: Post = {
          //   title: title,
          //   content: content,
          //   id: responseData.post.id,
          //   imagePath: responseData.post.imagePath
          // }
          // // const id = responseData.postId;
          // // post.id = id;
          // console.log(responseData.message);
          // this.posts.push(post);
          // this.postsUpdated.next([...this.posts]);
          this.router.navigate(["/"]);
        }
      );
  }

  updatePosts(title: string, content: string, id: string, image: File | string) {
    // const post: Post = { title: title, content: content, id: id, imagePath: null };
    let formData: Post | FormData;
    if ((typeof image === "object")) {
      formData = new FormData();
      formData.append("id", id);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("image", image, title);

    }
    else {
      formData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    // ====================================

    this.http.put("http://localhost:3000/api/posts/" + id, formData).subscribe(
      (response) => {
        // const updatedPosts = [...this.posts];
        // const oldpostIndex = updatedPosts.findIndex(p => p.id == id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""

        // }
        // updatedPosts[oldpostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);

      }
    )
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
