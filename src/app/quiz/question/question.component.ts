import { Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { interval, Subscription} from 'rxjs/';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/posts/post.model';
import { PostsService } from 'src/app/posts/posts.service';
import { Quiz } from '../quiz.model';
import { QuizzesService } from '../quizzes.service';
import { Answer } from "./answer.model";
import { Choice } from './choice.model';
import * as AOS from 'aos';

@Component({
    selector: 'app-question',
    templateUrl : './question.component.html',
    styleUrls: [ './question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {

  ordering:string[]=[];
  selectedOrder: string[]=[];
  matching:string[]=[];
  selectedMatch: string[]=[];
  res=false;
  resp:any[]=[];
  answers:any[]=[];
  index=1;
  secondes: number ;
  counterSubscription: Subscription;
  posts: Post[] = [];
  allPosts: Post[] = [];
  quizPosts: Post[] = [];
  Holyposts: Post[] = [];
  selectOption:string[] = [];
  quiz:Quiz;
  quizP:Quiz;
  user:any;
  tab2:string[]=[];
  answer:Answer[]=[];
  obj:Answer = {title:"", feedback:"", option:[]};
  objectif:Choice = {choice:"", response: false, isselected:false};
  result:boolean=false;
  tab:Post[]=[];
  table:Post[]=[];
  correctAnswer:string[]=[];
  incorrectAnswer:string[]=[];
  unAnswered=[];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 1;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription ;
  private authStatusSub: Subscription;
  taux: string;
  quizId:string;
  IDquestion:string[]=[];
  score: number = 0;
  answerSelected = false;
  correctAnswers:number = 0;
  incorrectAnswers:number = 0;
  correct:boolean;
  timeTaken=0;

  constructor(
    public postsService: PostsService,
    public quizzesService: QuizzesService,
    public route: ActivatedRoute,
    public router:Router,
    private authService: AuthService){
    this.secondes=0;
  }

  ngOnInit(){
    this.isLoading = true;
    AOS.init();
    const counter= interval(1000);
    this.counterSubscription=counter.subscribe(
      (value: number) =>
      {
        this.secondes=value;
      }
    );
    
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });
    this.taux = "width: 0%";
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
      this.quizzesService.getUser(this.userId).subscribe(userData=> {
        this.user ={
          email:    userData.email,
          password: userData.password,
          name:     userData.name,
          role:     userData.role
        };
      });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("quizId")) {
        this.quizId = paramMap.get("quizId");
        this.isLoading = true;
        this.quizzesService.getQuiz(this.quizId).subscribe(quizData=> {
          this.isLoading = false;
          this.IDquestion = quizData.IDquestion;
          this.quiz ={
            id:        quizData._id,
            name:      quizData.name,
            type:      quizData.type,
            IDquestion:quizData.IDquestion,
            imagePath: quizData.imagePath,
            creator:   quizData.creator
          };
          var k=0;
          for (let i=0; i < this.quiz.IDquestion.length; i++) {
            for (let j=0; j < this.posts.length; j++) {
              if(this.quiz.IDquestion[i] === this.posts[j].title){
                this.quizPosts[k]=this.posts[j];
                k++;
              }
            }
          }
        });
      }
    });
    this.isLoading = true;
    this.quizzesService.getAllAnswers();
    this.authStatusSub = this.quizzesService.getAnswerUpdateListener()
      .subscribe((answers: any[]) => {
        this.answers = answers;
        this.isLoading = false;
        for(let i=this.answers.length-1 ; i >= 0; i--){
          if(this.answers[i].userId == this.userId && this.answers[i].quizId == this.quizId){
            this.resp=this.answers[i];
            console.log("resp here=",this.resp);
            break;
          }
        }
        console.log("this.answers",this.answers);
        //console.log("this.resp",this.resp);
    });

    this.quizzesService.getAllPosts();
    this.authStatusSub = this.quizzesService.getPostUpdateListener()
       .subscribe((posts: Post[]) => {
         this.allPosts = posts;
         /*****/
         //console.log("this.quiz.name = ",this.quiz.name);
          for (let i = 0; i < this.allPosts.length; i++) {
            if(this.allPosts[i].quiz === this.quiz.name){
              this.Holyposts.push(this.allPosts[i]);
              var option=[];
              for (let j = 0; j < this.allPosts[i].answer.length; j++) {
                var obj0 = this.allPosts[i].answer[j].response;
                var obj1 = this.allPosts[i].answer[j].option;
                var obj2 = {choice:obj1, response: obj0,isselected:false};
                option.push(obj2);
              }
              var obj={title:this.allPosts[i].title, feedback:this.allPosts[i].feedback, option};
              this.answer.push(obj);
            }else{
              console.log("quiz name is not exist");
            }
          }
          //console.log("this.Holyposts =",this.Holyposts);
          //console.log("answer =",this.answer);
         /*****/
    });
  }

  getAnswer(answer:any[]){
    this.matching=[];
    for (let i = 0; i < answer.length; i++) {
      this.matching.push(answer[i].response);
    }
  }

  getAnswers(answer:any[]){
    this.ordering=[];
    for (let i = 0; i < answer.length; i++) {
      this.ordering.push(answer[i].response);
    }
  }

  onChange(){
    console.log("this.answer=",this.answer);
  }

  onChange2(newValue:any,index1:number,index2:number) {
    console.log(newValue);
    this.selectedMatch = newValue;
    this.answer[index1].option[index2].isselected = newValue;
    console.log("this.answer=",this.answer);
  }

  onChange3(newValue:any,index1:number,index2:number) {
    console.log(newValue);
    this.selectedMatch = newValue;
    this.answer[index1].option[index2].isselected = newValue;
    console.log("this.answer=",this.answer);
  }


  getResult(){
    console.log("oui");
    this.timeTaken = this.secondes;
    //console.log("this.resp = ",this.resp);
    var nbrEssay=1;
    if(this.resp.length == 0){
      this.quizzesService.addResponse(this.userId, this.quizId,this.timeTaken,nbrEssay, this.answer);
    }else{
      nbrEssay = this.resp.nbrEssay+1;
      console.log("nbrEssay=",nbrEssay);
      this.quizzesService.updateResponse(this.resp.id, this.userId, this.quizId,this.timeTaken,nbrEssay, this.answer);
    }
  }

 
  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe();
    this.postsSub.unsubscribe();
  }
}