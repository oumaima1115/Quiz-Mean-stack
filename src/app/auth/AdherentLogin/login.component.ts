import {Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from "rxjs";
import { CommonModule } from '@angular/common';  
import { AuthService } from "../auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginAdherentComponent implements OnInit, OnDestroy {
  isLoading = false;
  role="adherent";
  private authStatusSub: Subscription = new Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password, form.value.name, this.role);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
