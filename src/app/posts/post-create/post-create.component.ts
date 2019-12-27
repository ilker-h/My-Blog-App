import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  isLoading = false;
  imagePreview: string;
  private mode = 'create';
  private postId: string;
  // To use the reactive form approach, we store our form in a property
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      'title': new FormControl(null,
        { validators: [Validators.required, Validators.minLength(3)] }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    // paramMap is an observable
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        // checks if the URL has the dynamically changing 'postId' in it from app-routing.module.ts
        if (paramMap.has('postId')) {
          // if a postId exists, we're in edit mode
          this.mode = 'edit';
          this.postId = paramMap.get('postId'); // this will be a string
          this.isLoading = true;
          this.postsService.getPost(this.postId)
            // no need to unsubscribe because it's created by the Angular HTTP Client so it'll take care of that
            .subscribe(postData => {
              this.isLoading = false;
              this.post = {
                id: postData._id, title: postData.title, content: postData.content,
                imagePath: postData.imagePath, creator: postData.creator
              };
              // sets the value if the form does have a value and isn't null, like we initialized it to be above.
              // setValue() lets you set the values of all inputs or all controls whereas patchValue() lets you
              // target a single control, like we do in the onImagePicked() method below
              this.form.setValue({ 'title': this.post.title, 'content': this.post.content, 'image': this.post.imagePath });
            });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
      });
  }

  onImagePicked(event: Event) {
    // the "as" is a type conversion, otherwise TypeScript doesn't know that event.target has a files property
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    // you don't need to set this.isLoading back to false because we'll navigate away from this page anyway.
    // And when we come back to this page, the isLoading variable will be set back to false because it's
    // declared as false at the top (I think every time a page loads, an instance of the class that's loaded is created)
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
