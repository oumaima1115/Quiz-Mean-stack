import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { QuizzesService } from "../quiz/quizzes.service";
import { Post } from "./post.model";
import { Option } from "./option.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  private allpostsUpdated = new Subject<Post[]>();
 

  constructor(
    private http: HttpClient, 
    private router: Router,
    private quizzesService:QuizzesService) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        "http://localhost:3000/api/posts" + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title:    post.title,
                feedback: post.feedback,
                type:     post.type,
                answer:   post.answer,
                id:       post._id,
                imagePath:post.imagePath,
                quiz:     post.quiz,
                creator:  post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id:       string;
      title:     string;
      feedback:  string;
      type:      string;
      answer:    Array<Option>;
      imagePath: string;
      quiz: string;
      creator:   string;
    }>("http://localhost:3000/api/posts/" + id);
  }


  addPost(title: string, feedback: string, type: string, answer: Array<Option>, image: File, quiz: string) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("feedback", feedback);
    postData.append("type", type);

    for (let i = 0; i < answer.length; i++) {
      postData.append("answer", answer[i].option);
      postData.append("answer", answer[i].response);
    }
    postData.append("image", image, title);
    postData.append("quiz", quiz);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/list"]);
      });
  }

  updatePost(id: string, title: string, feedback: string, type: string, answer: Array<Option>, image: File | string, quiz: string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("feedback", feedback);
      postData.append("type", type);

      for (let i = 0; i < answer.length; i++) {
        postData.append("answer", answer[i].option);
        postData.append("answer", answer[i].response);
      }
      postData.append("image", image, title);
      postData.append("quiz", quiz);
      
    } else {
      postData = {
        id:        id,
        title:     title,
        feedback:  feedback,
        type:      type,
        answer:    answer,
        imagePath: image,
        quiz:      quiz,
        creator:   null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/list"]);
      });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);
  }
}
