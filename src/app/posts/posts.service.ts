import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from './post.model';

// make sure to add the slash after posts
const BACKEND_URL = environment.apiUrl + '/posts/';

// Note: this "providedIn: 'root' " is an alternative to providing the service in the app.module.ts file
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  // the things in <> are the types of data our subject yields
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage: number, currentPage: number) {
    // 'template literal' string syntax (as opposed to string interpolation)
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // return [...this.posts];
    // the get() method already turns the JSON into JavaScript
    // this is the data the frontend (this file) "get"s from the backend:
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map(
        (postData) => {
          return {
            posts: postData.posts.map( // this maps every array we get into a new array (see lecture 55. Transforming Response Data)
              // (so that the _id we get from the backend becomes id like the frontend expects in its post.model.ts)
              post => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath,
                  creator: post.creator
                };
              }), maxPosts: postData.maxPosts
          }; // rxjs will automatically wrap this into an observable so that .subscribe()
          // still subscribes to an observable (this .pipe() just happens earlier in the stream than .subscribe() )
        }
      ))
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {

    // THIS IS THE CODE THAT THE FOLLOWING COMMENTS ARE ABOUT:
    //  return { ...this.posts.find( p => p.id === id ) };

    // this returns an object so that it creates a clone of the object it's returning
    // the spread operator "..." pulls out all the properties of an object and adds them to a new object
    // so that we don't accidentally manipulate the original object in the array.
    // A find() function will be executed for each array and if it returns true, then the "post" object will return

    // So first, this "p => p.id === id" gets a specific post object.
    // Second, this spread operator "...this.posts.find( INSERT_POST_OBJECT ) " extracts its properties.
    // Third, this "return { ______ } " saves those extracted properties into a new object and returns it

    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);

  }

  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content }; // JSON can't store files so we can't use it
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // this 'title' refers to the image title, not the post title

    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        console.log(responseData.message);
        // const post: Post = { id: responseData.post.id, title: title, content: content, imagePath: responseData.post.imagePath };

        // this.posts.push(post); // then we store a post with that updated ID
        // this.postsUpdated.next([...this.posts]);
        // when you want to pass more than a normal string, you pass in an array of segments
        this.router.navigate(['/']);

        // the reason that we can use const here even if we want to over write it is that arrays are reference
        // types and so we're going to only overwrite one of the properties of the object while keeping the
        // object itself
        // const id = responseData.postId;
        // post.id = id; // so we updated the id property of that post
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post = { id: id, title: title, content: content, imagePath: null };
    let postData: Post | FormData;
    // This is checking if an image file was included in the post or not.
    // a file will be an object, a string will not
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title); // this title is the image's title, not post's title
    } else {
      // we're setting the creator value to null because we don't want the user to be able to edit their
      // user ID (since they can edit any code on the front end) so we have to handle this on the backend
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }

    // "post" is the payload here <-- (I think I was referring to postData)
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        console.log(response);
        // All of this is to create an immutable way to update the old posts
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = { id: id, title: title, content: content, imagePath: '' };
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // // now tell the app about it by sending a copy of the updated posts with it
        // this.postsUpdated.next([...this.posts]);
        // when you want to pass more than a normal string, you pass in an array of segments
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId); // postId is the dynamic parameter from :id in app.js
    // .subscribe(() => {
    //   console.log('Deleted!');
    //   // filter lets us only return a subset of that posts array. The method will run for every array element and if
    //   // it returns true, it'll be kept and if it's false then the element will not be part of the new filtered array.
    //   const updatedPosts = this.posts.filter(post => post.id !== postId); // so I want to delete the element where it's not equal
    //   this.posts = updatedPosts;
    //   this.postsUpdated.next([...this.posts]); // send a copy of this post so now the whole app knows about the deletion
    // });
  }
}
