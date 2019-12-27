import { Component, OnInit, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    // setting up the subscription to the authStatus listener. This yields the subscription.
    // This allows us to push that "is authenticated" or "is not authenticated" information
    // to components
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    // subscriptions for observables or subjects that are managed by me have to be unsubscribed from by me,
    // whereas built-in observables or subjects destroy themselves on their own
    this.authListenerSubs.unsubscribe();
  }

}

