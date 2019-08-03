import { Component, OnInit } from '@angular/core';
import { PostsService } from '../posts.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { };

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        })

      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    })

  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    };
    if (this.mode == 'create') {
      this.postsService.createPost(form.value.title, form.value.content, null);

    }
    if (this.mode == 'edit') {
      this.postsService.updatePosts(form.value.title, form.value.content, this.postId);

    }
    form.resetForm();

  }






}
