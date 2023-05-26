import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import {  RxReactiveFormsModule } from "@rxweb/reactive-form-validators"

import { MatInputModule }from "@angular/material/input";
import { MatCardModule }from "@angular/material/card";
import { MatButtonModule }from "@angular/material/button";
import { MatToolbarModule }from "@angular/material/toolbar";
import { MatExpansionModule }from "@angular/material/expansion";
import { MatProgressSpinnerModule }from "@angular/material/progress-spinner";
import { MatPaginatorModule }from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppComponent } from "./app.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { HeaderComponent } from "./header/header.component";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { AppRoutingModule } from "./app-routing.module";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { TakeQuizComponent } from "./quiz/result/result-quiz.component";
import { QuestionComponent} from "./quiz/question/question.component";
import { QuizComponent } from "./quiz/quiz/quiz.component";
import { QuizEssayComponent } from "./quiz/quizEssay/quiz-Essay.component";
import { FourOhFourComponent } from "./four-oh-four/four-oh-four.component";
import { BackgroundDirective } from './background.directive';
import { LoginAdherentComponent } from "./auth/AdherentLogin/login.component";
import { SignupAdherentComponent } from "./auth/AdherentSignup/signup.component"

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    TakeQuizComponent,
    QuestionComponent,
    QuizComponent,
    QuizEssayComponent,
    FourOhFourComponent,
    BackgroundDirective,
    LoginAdherentComponent,
    SignupAdherentComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RxReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
