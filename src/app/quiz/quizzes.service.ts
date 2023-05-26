import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Quiz } from "./quiz.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { Post } from "../posts/post.model";
import { Response } from "../quiz/question/response.model";
import { Answer } from "../quiz/question/answer.model";
import { QuizEssay } from "../quiz/result/quiz-Essay.model";
import { QuizTest } from "../quiz/quizTest.model";

@Injectable({
    providedIn: "root" 
})
export class QuizzesService{
  private quizzes: Quiz[] = [];
  private posts: Post[] = [];
  private answers: Response[] = [];
  private quizEssays: QuizEssay[] = [];
  private quizzesUpdated = new Subject<Quiz[]>();
  private postsUpdated = new Subject<Post[]>();
  private answersUpdated = new Subject<Response[]>();
  private quizEssayssUpdated = new Subject<QuizEssay[]>();
  

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  getQuizzes() {
    this.http
      .get<{ message: string; quizzes: any }>("http://localhost:3000/api/quizzes")
      .pipe(
        map(quizData => {
          return quizData.quizzes.map(quiz => {
            return {
              name:      quiz.name,
              type:      quiz.type,
              id:        quiz._id,
              IDquestion:quiz.IDquestion,
              imagePath: quiz.imagePath,
              creator:   quiz.creator
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.quizzes = transformedPosts;
        this.quizzesUpdated.next([...this.quizzes]);
      });
  }

  getAllPosts(){
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title:           post.title,
              feedback:        post.feedback,
              type:            post.type,
              answer:          post.answer,
              id:              post._id,
              imagePath:       post.imagePath,
              correctChoices:  post.correctChoices,
              numberOfChoices: post.numberOfChoices,
              quiz:            post.quiz,
              creator:         post.creator
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getAllAnswers(){
    this.http
      .get<{ message: string; answers: any }>("http://localhost:3000/api/responses")
      .pipe(
        map(answerData => {
          return answerData.answers.map((answer:any) => {
            return {
              id:        answer._id,
              userId:    answer.userId,
              quizId:    answer.quizId,
              timeTaken: answer.timeTaken,
              nbrEssay:  answer.nbrEssay, 
              answer:    answer.answer
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.answers = transformedPosts;
        this.answersUpdated.next([...this.answers]);
      });
  }

  getAllTrials(){
    this.http
      .get<{ message: string; quizEssays: any }>("http://localhost:3000/api/quizEssays")
      .pipe(
        map(quizEssaysData => {
          return quizEssaysData.quizEssays.map(quizEssays => {
            return {
              id:              quizEssays._id,
              nbrEssay:        quizEssays.nbrEssay,
              score:           quizEssays.score,
              correctAnswer:   quizEssays.correctAnswer,
              incorrectAnswer: quizEssays.incorrectAnswer, 
              UnAnswered:      quizEssays.UnAnswered,
              passingGrade:    quizEssays.passingGrade, 
              timeTaken:       quizEssays.timeTaken,
              IDResponse:      quizEssays.IDResponse
            };
          });
        })
      )
      .subscribe(transformedQuizEssays => {
        this.quizEssays = transformedQuizEssays;
        this.quizEssayssUpdated.next([...this.quizEssays]);
      });

  }

  getQuizUpdateListener() {
    return this.quizzesUpdated.asObservable();
  }
  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }
  getAnswerUpdateListener(){
    return this.answersUpdated.asObservable();
  }
  getTrialUpdateListener(){
    return this.quizEssayssUpdated.asObservable();
  }

  getQuiz(id: string) {
    return this.http.get<{
      _id:       string;
      name:      string;
      type:      string;
      IDquestion:Array<string>;
      imagePath: string;
      creator:   string;
    }>("http://localhost:3000/api/quizzes/" + id);
  }

  getUser(id: string){
    return this.http.get<{
      _id:       string;
      email:     string;
      password:  string;
      name:      string;
      role:      string;
    }>("http://localhost:3000/api/user/" + id);
  }

  UpdateQuiz1(quiz:any,title:any){//add title of question into quiz
    var quizData: Quiz;
    var id=quiz.id;
    var tab =[];
    tab=quiz.IDquestion;
    tab[tab.length]=title;
    quizData = {
      id:         id,
      name:       quiz.name,
      type:       quiz.type,
      IDquestion: tab,
      imagePath:  quiz.imagePath,
      creator:    null
    };
    console.log("quizData=",quizData);
    this.http
      .put("http://localhost:3000/api/quizzes/" + id, quizData)
      .subscribe(response => {
        this.router.navigate(["/list"]);
      });
  }

  UpdateQuiz2(quiz:any,title:string){//delete question from quiz
    var quizData: Quiz;
    var id=quiz.id;
    var tab: string[] =[];
    tab=quiz.IDquestion;
    var i=0;
    if(tab.length == 1){
      tab = [];
    }else{
      while(i<tab.length){
        if(tab[i]==title){
          tab.splice(i,1);
          break;
        }else{
          i++;
        }
      }
    }
    quizData = {
      id:         id,
      name:       quiz.name,
      type:       quiz.type,
      IDquestion: tab,
      imagePath:  quiz.imagePath,
      creator:    null
    };
    this.http
      .put("http://localhost:3000/api/quizzes/" + id, quizData)
      .subscribe(response => {
        this.router.navigate(["/list"]);
      });
  }

  UpdateQuiz3(quiz:Quiz,title1:string,title2:string){//update title with another one
    var quizData: Quiz;
    var id=quiz.id;
    var tab =[];
    tab=quiz.IDquestion;
    var i=0;
    while(i<tab.length){
      if(tab[i]==title1){
        tab[i]=title2;
        break;
      }else{
        i++;
      }
    }
    quizData = {
      id:         id,
      name:       quiz.name,
      type:       quiz.type,
      IDquestion: tab,
      imagePath:  quiz.imagePath,
      creator:    null
    };
    this.http
      .put("http://localhost:3000/api/quizzes/" + id, quizData)
      .subscribe(response => {
        this.router.navigate(["/list"]);
      });
  }

  addQuiz(name: string, type: string, image: File){
    const quizData = new FormData();
    quizData.append("name", name);
    quizData.append("type", type);
    quizData.append("image", image, name);

    this.http
      .post<{ message: string; quiz: Quiz }>(
        "http://localhost:3000/api/quizzes",
        quizData
      )
      .subscribe(responseData => {
        this.router.navigate(["/quiz"]);
      });
  }

  updateQuiz(id:string, name: string, type: string, IDquestion:string[], image:  File){//edite
    let quizData: Quiz | FormData;
    if (typeof image === "object") {
      quizData = new FormData();
      quizData.append("id", id);
      quizData.append("name", name);
      quizData.append("type", type);
      quizData.append("image", image, name);
      for (let i = 0; i < IDquestion.length; i++) {
        quizData.append("IDquestion", IDquestion[i]);
      }
    } else {
      quizData = {
        id:         id,
        name:       name,
        type:       type,
        IDquestion: IDquestion,
        imagePath:  image,
        creator:    null
      };
    }
    this.http
      .put("http://localhost:3000/api/quizzes/" + id, quizData)
      .subscribe(response => {
        this.router.navigate(["/quiz"]);
      })
    ;
  }

  deleteQuiz(quizId: string) {
    this.http
      .delete("http://localhost:3000/api/quizzes/" + quizId)
      .subscribe(() => {
        const quizzesUpdated = this.quizzes.filter(quiz => quiz.id !== quizId);
        this.quizzes = quizzesUpdated;
        this.quizzesUpdated.next([...this.quizzes]);
      });
  }
  deletePost2(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        const postsUpdated = this.posts.filter(post => post.id !== postId);
        this.posts = postsUpdated;
        this.postsUpdated.next([...this.posts]);
      });
  }


  addResponse(userId:string, quizId:string, timeTaken:number,nbrEssay:number, answer:Array<Answer>){
    this.http.post<{message: string; response: Response }>
    ('http://localhost:3000/api/responses',
      {
        userId,
        quizId,
        timeTaken,
        nbrEssay,
        answer
      }
    ).subscribe(response => {
      this.router.navigate(['/res',{id:null}]);
    });
  }

  updateResponse(id:string, userId:string, quizId:string, timeTaken:number,nbrEssay:number, answer:Array<Answer>){
    const answerData = {
      id:         id,
      userId:     userId,
      quizId:     quizId,
      timeTaken:  timeTaken,
      nbrEssay:   nbrEssay,
      answer:     answer
    };
    console.log("answerData=",answerData);
    this.http
      .put("http://localhost:3000/api/responses/" + id, answerData)
      .subscribe(response => {
        this.router.navigate(['/res',{id:id}]);
    });
  }

  deleteResponse(answerId:string){
    this.http
      .delete("http://localhost:3000/api/responses/" + answerId)
      .subscribe(() => {
        const answersUpdated = this.answers.filter(answer => answer.id !== answerId);
        this.answers = answersUpdated;
        this.answersUpdated.next([...this.answers]);
      });
  }

  addEssayQuiz(nbrEssay:number,score:number,correctAnswer:number,incorrectAnswer:number,UnAnswered:number,passingGrade:string,timeTaken:number,IDResponse:string){
    console.log(nbrEssay,"/",score,"/",correctAnswer,"/",incorrectAnswer,"/",UnAnswered,"/",passingGrade,"/",timeTaken,"/",IDResponse);
    this.http.post<{message: string; quizEssay: QuizEssay }>
    ('http://localhost:3000/api/quizEssays',
      {
        nbrEssay,
        score,
        correctAnswer,
        incorrectAnswer,
        UnAnswered,
        passingGrade,
        timeTaken,
        IDResponse
      }
    ).subscribe(response => {
      console.log("yeeeh!");
    });
  }

  deleteTrials(trialId:string){
    this.http
      .delete("http://localhost:3000/api/quizEssays/" + trialId)
      .subscribe(() => {
        console.log("9999yyy");
        const quizEssayssUpdated = this.quizEssays.filter(trial => trial.id !== trialId);
        this.quizEssays = quizEssayssUpdated;
        this.quizEssayssUpdated.next([...this.quizEssays]);
      });
  }

  addQuizTest(nbrEssay:number,score:number,correctAnswer:number,incorrectAnswer:number,UnAnswered:number,passingGrade:string,timeTaken:number,quizId:string,userId:string){
    console.log(nbrEssay,"/",score,"/",correctAnswer,"/",incorrectAnswer,"/",UnAnswered,"/",passingGrade,"/",timeTaken,"/",quizId,"/",userId);
    this.http.post<{message: string; quizTest: QuizTest}>
    ('http://localhost:3000/api/quizTest',
      {
        nbrEssay,
        score,
        correctAnswer,
        incorrectAnswer,
        UnAnswered,
        passingGrade,
        timeTaken,
        quizId,
        userId
      }
    ).subscribe(response => {
      console.log("yeeeh1!");
    });
  }

}