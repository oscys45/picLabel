import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ AuthService ]
})
export class LoginComponent {

  private model: User;
  private passwordMessage: string = ""

  /**
   * Constructor
   * @param {Router} router
   * @param {AuthService} authService
   */
  constructor(private router: Router,
              private authService: AuthService) {

    this.model = new User();

    if (authService.isAuthenticated) {
      this.router.navigate([ 'jpegs' ]);
    }
  }

  /**
   * Event handler for login button.
   * Authenticate user and head for the JPegs page.
   */
  private loginClick(): void {

    // TODO:  response should only be 1 type.
    this.authService.login(this.model).then((response: any) => {
      // TODO:  Amateur.
      if (response.username) {
          this.passwordMessage = "";
          this.router.navigate([ 'jpegs' ]);
        } else {
          this.passwordMessage = response.statusText;
        }
      });

  }
}
