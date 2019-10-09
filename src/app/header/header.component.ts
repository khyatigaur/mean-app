import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  isUserAuthenticated = false;
  constructor(private authService: AuthService) { }
  ngOnInit() {
    this.isUserAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
      }
    );
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }
  onLogout() {
    this.authService.logout();
  }



}
