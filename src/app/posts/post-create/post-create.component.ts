import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { Quiz } from "../../quiz/quiz.model";
import { QuizzesService } from "src/app/quiz/quizzes.service";
import {MatSnackBar} from '@angular/material/snack-bar';
import { PizzaPartyComponent } from "./snack-bar-component-example";

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.scss"]
})
export class PostCreateComponent implements OnInit, OnDestroy {

  post: Post;
  isLoading = false;
  form: FormGroup;
  answer: FormArray;
  imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  CorrectAnswer:string;
  varAll:string;
  varOne:string;
  selected: string='Multiple';
  selectedQuiz: string="";
  quizzes: Quiz[] = [];
  durationInSeconds = 6;

  types: Type[] = [
    {value: 'Multiple', viewValue: 'Multiple'},
    {value: 'Ordering', viewValue: 'Ordering'},
    {value: 'Match', viewValue: 'Match'}
  ];

  constructor(
    public postsService: PostsService,
    public quizzesService: QuizzesService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private router:Router
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form =  new FormGroup({
        title:   new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        feedback:new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
        answer:  this.formBuilder.array([], this.createAnswer(null,null) ),
        image:   new FormControl(null, {
            validators: [Validators.required],
            asyncValidators: [mimeType]
        })
    });

    this.quizzesService.getQuizzes();
    this.authStatusSub = this.quizzesService.getQuizUpdateListener()
      .subscribe((quizzes: Quiz[]) => {
        this.quizzes = quizzes;
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          for (let i = 0; i < postData.answer.length; i++) {
            const option =postData.answer[i].option;
            const response = postData.answer[i].response;
            this.addAnswer(option,response);
            this.varAll=option;
            this.varOne=response;
            this.answer.value[i].option = postData.answer[i].option;
            this.answer.value[i].response = postData.answer[i].response;
          }
          this.imagePreview = postData.imagePath;
          console.log("this.form.value['answer'] = ",this.form.value['answer']);
          this.post = {
            id:        postData._id,
            title:     postData.title,
            feedback:  postData.feedback,
            type:      postData.type,
            answer:    postData.answer,
            imagePath: postData.imagePath,
            quiz:      postData.quiz,
            creator:   postData.creator
          };
          this.selected = this.post.type;
          this.selectedQuiz = this.post.quiz;
          this.form.setValue({
            title:   this.post.title,
            feedback:this.post.feedback,
            answer:  this.post.answer,
            image:   this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
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

  openSnackBar() {
    this._snackBar.openFromComponent(PizzaPartyComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    var i;
    this.isLoading = true;
    if (this.mode === "create") {
      if(this.form.value['answer'].length > 1){
        var existBefore=false;
        /**verify all quizzes if the title of the question it exist before or no */
        for (let j=0; j < this.quizzes.length; j++) {
          if(this.quizzes[j].IDquestion.includes(this.form.value.title)){
            existBefore=true;
          }
        }
        if(!existBefore){
          i=0;
          while(i < this.quizzes.length){
            if(this.quizzes[i].name === this.selectedQuiz){
              this.quizzesService.UpdateQuiz1(this.quizzes[i],this.form.value.title);
              break;
            }
            else{
              i=i+1;
            }
          }
        }
        this.postsService.addPost(
          this.form.value.title,
          this.form.value.feedback,
          this.selected,
          this.form.value['answer'],
          this.form.value.image,
          this.selectedQuiz
        );
      }else{
        this.openSnackBar();
        this.router.navigate(["/list"]);
      }
    } else {
      if(this.post.title !== this.form.value.title){
        console.log("yes");
        i=0;
        while(i < this.quizzes.length){
          if(this.quizzes[i].name === this.selectedQuiz){
            this.quizzesService.UpdateQuiz3(this.quizzes[i],this.post.title,this.form.value.title);
            break;
          }
          else{
            i=i+1;
          }
        }
      }
      else{
        if(this.post.quiz !== this.selectedQuiz ){
          console.log("yees");
          i=0;
          while(i < this.quizzes.length){
            if(this.quizzes[i].name === this.selectedQuiz){
              this.quizzesService.UpdateQuiz1(this.quizzes[i],this.post.title);
              break;
            }else{
              i=i+1;
            }
          }
          var j=0;
          while(j < this.quizzes.length){
            if(this.quizzes[j].name === this.post.quiz){
              this.quizzesService.UpdateQuiz2(this.quizzes[j],this.post.title);
              break;
            }else{
              j=j+1;
            }
          }
        }
      }
      console.log("this.form.value['answer']=",this.form.value['answer']);
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.feedback,
        this.selected,
        this.form.value['answer'],
        this.form.value.image,
        this.selectedQuiz
      );
    }
    this.form.reset();
  }

  patchValues(option: any, response: any) {
    return this.formBuilder.group({
      option: [option],
      response: [response]
    })    
  }
  
  getAnswer() {
    return this.form.get('answer') as FormArray;
  }

  createAnswer(v1: any,v2: any): FormGroup {
    return this.formBuilder.group({
      'option': [v1],
      'response': [v2, Validators.required],
    });
  }

  addAnswer(v1:any,v2:any): void {
    this.answer = this.form.get('answer') as FormArray;
    this.answer.push(this.createAnswer(v1,v2));
  }

  onRemoveAnswer(index: number) {
    this.getAnswer().controls.splice(index);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}