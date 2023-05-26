import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { QuizzesService } from "../quiz/quizzes.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  role="";
  user:any;
  userId:string;
  private authStatusSub: Subscription;
  constructor(private authService: AuthService, private quizzesService:QuizzesService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      }
    );
  
    this.userId = this.authService.getUserId();
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
    this.role = this.user.role;
    console.log("role = ",this.user.role);
    console.log("email = ",this.user.email);
    console.log("name = ",this.user.name);
    });
    if(this.role == "admin" || "adherent"){
      window.onload = () => {
        console.log("ONLOAD");
      };
    }
  }

  onLogout() {
    this.authService.logout();
    this.role="";
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
