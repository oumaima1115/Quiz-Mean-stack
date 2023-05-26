import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";
import { QuestionComponent } from "./quiz/question/question.component";
import { QuizComponent } from "./quiz/quiz/quiz.component";
import { FourOhFourComponent } from "./four-oh-four/four-oh-four.component";
import { TakeQuizComponent } from "./quiz/result/result-quiz.component";
import { LoginAdherentComponent } from "./auth/AdherentLogin/login.component";
import { SignupAdherentComponent } from "./auth/AdherentSignup/signup.component";

const routes: Routes = [
  { path: "list", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "loginAdherent", component: LoginAdherentComponent },
  { path: "signupAdherent", component: SignupAdherentComponent },
  { path: "question", component: QuestionComponent },
  { path: "question/:quizId", component: QuestionComponent, canActivate: [AuthGuard] },
  { path: "quiz", component: QuizComponent, canActivate: [AuthGuard] },
  { path: "update/:quizId", component: QuizComponent, canActivate: [AuthGuard] },
  { path: "res", component: TakeQuizComponent, canActivate: [AuthGuard] },
  {path: 'not-found' , component: FourOhFourComponent},
  {path: '**' , redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}