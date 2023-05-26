import { Component, Input} from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { QuizzesService } from "../quizzes.service";

@Component({
    selector: "app-quizEssay",
    templateUrl: "./quiz-Essay.component.html"
})
export class QuizEssayComponent {
    @Input() nbrEssay=0;
    @Input() score=0;
    @Input() totalPosts=0;
    @Input() correctAnswer=0;
    @Input() incorrectAnswer=0;
    @Input() unAnswered=0;
    @Input() passingGrade="";
    @Input() timeTaken=0;
    @Input() IDResponse="";
    @Input() quizId="";
    @Input() userId="";
    private authStatusSub:Subscription;
    trials: any[]=[];
    
    constructor(public quizzesService:QuizzesService,public router:Router){}
    ngOnInit(){
        this.quizzesService.getAllTrials();
        this.authStatusSub = this.quizzesService.getTrialUpdateListener()
        .subscribe((trials:any) => {
            this.trials = trials;
            var cas=0;
            for(let i=0;i<this.trials.length;i++){
                if(this.trials[i].nbrEssay == this.nbrEssay && this.trials[i].IDResponse == this.IDResponse){
                    cas++;
                    break;
                }
            }
            if(cas==0){
                this.quizzesService.addEssayQuiz(
                    this.nbrEssay,
                    this.score,
                    this.correctAnswer,
                    this.incorrectAnswer,
                    this.unAnswered,
                    this.passingGrade,
                    this.timeTaken,
                    this.IDResponse
                );
                this.quizzesService.addQuizTest(
                    this.nbrEssay,
                    this.score,
                    this.correctAnswer,
                    this.incorrectAnswer,
                    this.unAnswered,
                    this.passingGrade,
                    this.timeTaken,
                    this.quizId,
                    this.userId
                );
                console.log("youppii!");
            }
        });
    }
}