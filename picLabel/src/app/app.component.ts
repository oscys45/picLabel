import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ AuthService ]
})
export class AppComponent {

  private title: string  = 'EXIF Editor';

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private authService: AuthService) {  }

  /**
   * Event handler for logout button.
   */
  private logoutClick(): void {
    this.authService.logout();
  }
}
