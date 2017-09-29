import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ AuthService ]
})
export class AppComponent {

  private title: string  = 'Irma Annotator';

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private authService: AuthService,
              private router: Router) {  }

  /**
   * Event handler for logout button.
   */
  private logoutClick(): void {
    this.authService.logout();
  }
}
