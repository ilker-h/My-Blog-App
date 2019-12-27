import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material';

import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'This is the first post's content' },
  //   { title: 'Second Post', content: 'This is the second post's content' },
  //   { title: 'Third Post', content: 'This is the third post's content' }
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  // not in instructor's code, it's from:
  // https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/lecture/10540084#questions/5221386
  @ViewChild('paginator') paginator: any;

  constructor(public postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuhenticated => {
        this.userIsAuthenticated = isAuhenticated;
        this.userId = this.authService.getUserId();
      });
  }

  // PageEvent is just an object holding some data about the current page. You can do console.log(pageData) to see it
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {

      // not in instructor's code, it's from:
      // https://www.udemy.com/angular-2-and-nodejs-the-practical-guide/learn/lecture/10540084#questions/5221386
      if (this.totalPosts - 1 - (this.postsPerPage * (this.currentPage - 1)) <= 0) {
        this.currentPage = (this.currentPage === 1) ? 1 : this.currentPage - 1;
        this.paginator.pageIndex = this.currentPage - 1;
        this.totalPosts = (this.totalPosts === 0) ? 0 : this.totalPosts - 1;
        this.paginator.page.next({
          pageIndex: this.paginator.pageIndex,
          pageSize: this.paginator.pageSize,
          length: this.totalPosts
        });
      }
      // ^not in instructor's code

      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
