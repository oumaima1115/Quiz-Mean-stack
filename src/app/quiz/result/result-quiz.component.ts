import { Component} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription} from 'rxjs/';
import { QuizzesService } from "../quizzes.service";
import { QuizEssay } from "./quiz-Essay.model";

@Component({
    selector: "app-result-quiz",
    templateUrl: "./result-quiz.component.html",
    styleUrls: ["./result-quiz.component.scss"]
})
export class TakeQuizComponent {

  QuizEssay:QuizEssay;
  isLoading = false;
  counterSubscription: Subscription;
  private authStatusSub: Subscription;
  userId: any;
  quizId:any;
  answers:Response[]=[];
  answer: any;
  allAnwser: string[]=[];
  tab:string[]=[];
  correctAnswer:any[]=[];
  incorrectAnswer:any[]=[];
  unAnswered:any[]=[];
  user:any;
  correct=0;
  incorrect=0;
  unanswer=0;
  trial=false;
  //obj = {id:"",userId:"",quizId:"",timeTaken:0,nbrEssay:0,answer:[{title:"",feedback:"",option:[{choice:"",response:false, isselected:false}]}]};
  obj:any;
  id:string | null;
    constructor(private route: ActivatedRoute, private quizzesService: QuizzesService){}

    ngOnInit(){
      this.isLoading = true;
      this.quizzesService.getAllAnswers();
      this.authStatusSub = this.quizzesService.getAnswerUpdateListener()
        .subscribe((answers: any[]) => {
          
          if(this.id==null){
          this.answers = answers;
          this.id = this.route.snapshot.paramMap.get('id');
          console.log("this.answers[this.answers.length-1]= ",this.answers[this.answers.length-1]);
          console.log("id===",this.id);
            this.obj = this.answers[this.answers.length-1];
            console.log("this.answers[this.answers.length-1]= ",this.answers[this.answers.length-1]);
            this.obj = this.answers[this.answers.length-1];
            console.log("this.obj= ",this.obj);
          }else{
            this.answers = answers;
            this.id = this.route.snapshot.paramMap.get('id');
            console.log("this.answers[this.answers.length-1]= ",this.answers[this.answers.length-1]);
            console.log("id===",this.id);
            for (let i = 0; i < this.answers.length; i++) {
              if(this.answers[i].id == this.id){
                this.obj = this.answers[i];
                //console.log("this.obj= ",this.obj);
                break;
              } 
            }
          }
          this.isLoading = false;
          
          
        this.isLoading = true;
          this.quizzesService.getUser(this.obj.userId).subscribe(userData=> {
            this.user ={
              email:    userData.email,
              password: userData.password,
              name:     userData.name,
              role:     userData.role
            };
            this.isLoading = false;
          console.log("email = ",this.user.email);
          console.log("name = ",this.user.name);
          });
          console.log("this.obj = ",this.obj);
        }
      );
      //this.quizzesService.addQuizTest(nbrEssay,score, correctAnswer, incorrectAnswer, UnAnsered,pasingGrade,timeTaken);
    }

    getColor(response:boolean|string|number,isselected:boolean|string|number){
      switch (typeof isselected) {
        case "string":
          if(response == isselected){
            return "green";
          }else{
            if(response !== isselected){
              return "red";
            }else{
              return "";
            }
          }
        case "boolean":
          if(response == isselected && response === true ){
            return "green";
          }else{
            if(response === false && isselected === true ){
              return "red";
            }else{
              return "";
            }
          }
        case "number":
          if(response == isselected){
            return "green";
          }else{
            if(response !== isselected){
              return "red";
            }else{
              return "";
            }
          }
      }
      
    }

    getStatus(option:any[],title:string,index:number){
      //console.log("answer===",this.obj.answer);
      //console.log("j=",index);
      if(index == this.obj.answer.length){
        this.trial=true;
      }
      var status="";
      switch (typeof option[0].response){
        case "boolean":{
          for (let i = 0; i < option.length; i++) {
            if(option[i].response ===false && option[i].isselected === true){
              status= "InCorrect";
              break;
            }else{
              if(option[i].response ===true && option[i].isselected === true){
                status= "Correct";
              }
            }
          }
          break;
        }
        case "number":
        case "string":{
          for (let i = 0; i < option.length; i++) {
            if(option[i].isselected === false){
              status= "Unanswered";
              break;
            }else{
              if(option[i].response !== option[i].isselected ){
                status= "InCorrect";
              }else{
                if(option[i].response === option[i].isselected){
                  status= "Correct";
                }
              }
            }
          }
          break;
        }
      }
      //console.log("status=",status);
      if(status === "" || status === "Unanswered"){
        this.unAnswered.push(title);
        return "Unanswered";
      }else{
        if(status === "Correct"){
          this.correctAnswer.push(title);
          return "Correct";
        }else{
          this.incorrectAnswer.push(title);
          return "InCorrect";
        }
      }
    }

    getCorrectAnswer(){
      let uniqueChars = [...new Set(this.correctAnswer)];
      return uniqueChars.length;
    }
  
    getInCorrectAnswer(){
      let uniqueChars = [...new Set(this.incorrectAnswer)];
      return uniqueChars.length;
    }
  
    getUnAnswered(){
      let uniqueChars = [...new Set(this.unAnswered)];
      return uniqueChars.length;
    }
  }