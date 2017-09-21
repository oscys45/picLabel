import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  /**
   * Constructor
   * @param {AuthService} auth
   * @param {Router} router
   */
  constructor(private auth: AuthService, private router: Router) { }

  /**
   * Implementation of canActivate (check auth service for authentication).
   * @returns {boolean}
   */
  public canActivate(): boolean {

    // User not logged in?  Go home.
    if (!this.auth.isAuthenticated) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
