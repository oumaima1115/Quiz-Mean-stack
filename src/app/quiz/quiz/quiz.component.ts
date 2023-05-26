import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from "rxjs";
import { QuizzesService } from "../quizzes.service";
import { mimeType } from "../../posts/post-create/mime-type.validator";
import { Quiz } from "../quiz.model";
import { Post } from "src/app/posts/post.model";
import { PostsService } from "src/app/posts/posts.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { PizzaPartyComponent } from "./snack-bar-component-example-snack";
import { TrialComponent } from "./trial.component";
interface Type {
  value: string;
  viewValue: string;
}

@Component({
    selector: "app-quiz",
    templateUrl: "./quiz.component.html",
    styleUrls: ["./quiz.component.scss"],
})
export class QuizComponent implements OnInit{
  
  isLoading = false;
  role:string;
  response:Response[]=[];
  answers:any[]=[];
  userIsAuthenticated = false;
  userId: string;
  user:any;
  trials:any[]=[];
  nbrEssay=0;
  display=true;
  form: FormGroup;
  selected: string='Hard';
  IDquestion:string[]=[];
  posts:Post[] = [];
  private mode = "create";
  imagePreview: string;
  private quizId: string;
  private authStatusSub: Subscription;
  quizzes: Quiz[] = [];
  quiz:Quiz;
  durationInSeconds = 5;
  types: Type[] = [
    {value: 'Hard', viewValue: 'Hard'},
    {value: 'Easy', viewValue: 'Easy'},
    {value: 'Low', viewValue: 'Low'}
  ];
  
  constructor(
    public quizzesService: QuizzesService,
    public postsService:PostsService,
    public route: ActivatedRoute,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.form =  new FormGroup({
        name: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        image:   new FormControl(null, {
          validators: [Validators.required],
          asyncValidators: [mimeType]
      })
    }); 
    this.quizzesService.getQuizzes();
    this.authStatusSub = this.quizzesService.getQuizUpdateListener()
      .subscribe((quizzes: Quiz[]) => {
        this.quizzes = quizzes;
        this.isLoading = false;
    });
    /*get user id*/
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("quizId")) {
        this.mode = "edit";
        this.quizId = paramMap.get("quizId");
        this.quizzesService.getQuiz(this.quizId).subscribe(quizData => {
          this.imagePreview = quizData.imagePath;
          this.quiz = {
            id:        quizData._id,
            name:      quizData.name,
            type:      quizData.type,
            IDquestion: quizData.IDquestion,
            imagePath: quizData.imagePath,
            creator:   quizData.creator
          };
          this.selected=this.quiz.type;
          this.form.setValue({
            name:   this.quiz.name,
            image:   this.quiz.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.quizId = null;
      }
    });
    this.quizzesService.getUser(this.userId).subscribe(userData=> {
      this.user ={
        email:    userData.email,
        password: userData.password,
        name:     userData.name,
        role:     userData.role
      };
      this.role = this.user.role;
    console.log("role = ",this.user.role);
    console.log("email = ",this.user.email);
    console.log("name = ",this.user.name);
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveQuiz() {
    if (this.form.invalid) {
        return;
    }
    if (this.mode === "create") {
      this.quizzesService.addQuiz(
          this.form.value.name,
          this.selected,
          this.form.value.image
      );
      this.router.navigate(["/list"]);
    }else{
      console.log("1) this.form.value.name",this.form.value.name);
      this.quizzesService.updateQuiz(
        this.quizId,
        this.form.value.name,
        this.selected,
        this.quiz.IDquestion,
        this.form.value.image
      );
      console.log("2) this.form.value.name",this.form.value.name);
      var name = this.form.value.name;
      this.quizzesService.getAllPosts();
      this.authStatusSub = this.quizzesService.getPostUpdateListener()
        .subscribe((posts: Post[]) => {
          this.posts = posts;
          console.log("3) name",name);
          for (let i = 0; i < this.posts.length; i++){
            if(this.posts[i].quiz == this.quiz.name){
              this.postsService.updatePost(
                this.posts[i].id,
                this.posts[i].title,
                this.posts[i].feedback,
                this.posts[i].type,
                this.posts[i].answer,
                this.posts[i].imagePath,
                name
              );
            }
          }
      });      
    }
    this.form.reset();
  }

  openSnackBar() {
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }
  openSnackBar2(){
    this._snackBar.openFromComponent(TrialComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  onDelete(quizId: string){
    this.quizzesService.getAllPosts();
    this.authStatusSub = this.quizzesService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
    });
    this.quizzesService.getQuiz(quizId).subscribe(quizData => {
      this.IDquestion=quizData.IDquestion;
    });
    if(this.posts.length !== 0){
      console.log("posts=",this.posts);
      var j;
      var name="";
      var i;
      if(this.IDquestion.length == 0){
        this.quizzesService.deleteQuiz(quizId);
      }
      this.quizzesService.getAllTrials();
      this.authStatusSub = this.quizzesService.getTrialUpdateListener()
        .subscribe((trials: any[]) => {
          this.trials = trials;
      });
      /*get all answers*/
      this.quizzesService.getAllAnswers();
      this.authStatusSub = this.quizzesService.getAnswerUpdateListener()
      .subscribe((answers: any[]) => {
        this.answers = answers;
        console.log("this.answers=",this.answers);
        var tab=[];
        for (let i = 0; i < this.answers.length; i++) {
          if(this.answers[i].quizId == quizId){
            /*get all trials of this response */
            for (let i = 0; i < this.trials.length; i++) {
              if(this.trials[i].IDResponse == this.answers[i].id){
                tab.push(this.trials[i].id);
                //console.log("this.trials[i]=",this.trials[i]);
                //console.log("table=",tab);
              }
            }
            /*delete response */
            console.log("this.answers[i]=",this.answers[i]);
            this.quizzesService.deleteResponse(this.answers[i].id);
            break;
          }
        }
        console.log("******tab=",tab);
        for (let j = 0; j < tab.length; j++){
          this.quizzesService.deleteTrials(tab[j].id);
        }
      });
    
      console.log("this.IDquestion=",this.IDquestion);
      for(i=0; i < this.IDquestion.length;i++){
        name=this.IDquestion[i];
        j=0;
        while(j < this.posts.length){
          if(this.posts[j].title === name ){
            this.quizzesService.deletePost2(this.posts[j].id);
            console.log("name====",name);
            break;
          }
          j++;
        }
        name="";
      }
      if(i == this.IDquestion.length){
        this.quizzesService.deleteQuiz(quizId);
        this.openSnackBar();
      }
    }else{
      console.log("opps!!");
    }
  }

  play(quizid:string){
    this.quizzesService.getAllAnswers();
    this.authStatusSub = this.quizzesService.getAnswerUpdateListener()
      .subscribe((answers: any[]) => {
        this.response = answers;
        for (let i = 0; i < this.response.length; i++) {
          if(this.response[i].quizId == quizid && this.response[i].userId == this.userId){
            this.nbrEssay = this.response[i].nbrEssay;
            break;
          }
        }
        if(this.nbrEssay >= 5){
          this.openSnackBar2();
        }else{
          this.router.navigate(['/question',quizid]);
        }
    });
  }
}