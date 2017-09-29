import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

// import * as blobUtil from 'blob-util';

// TODO:  Gallery should be a component.

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [ UserService ]
})
export class UsersComponent {

  private users: Observable<Array<User>>;
  private userValues: Array<User> = [];
  private selectedUser: User = new User();
  //private checkboxMap: Map<string, any> = new Map<string, any>();

  /**
   * Constructor
   * @param {AuthService} authService
   */
  constructor(private authService: AuthService,
              private userService: UserService) {
    this.populateUsers();
  }

  /**
   * Set current user to the selected one.
   * @param user
   */
  private setSelectedUser(user: User): void {
    this.selectedUser = (user ? user : new User());
  }

  /**
   * Update/insert user.
   */
  private saveUser(): void {

    let user = this.selectedUser;

    if (user._id) {
      this.userService.update(user);
    } else {
      this.userService.add(user).subscribe((result) => { console.log(result); });
    }
  }

  /**
   * Select or deselect all images in checkboxMap.
   * @param {boolean} select
   */
  // private selectAll(select: boolean): void {
  //   this.checkboxMap.forEach((val, key, map) => {
  //     val.selected = select;
  //   });
  // }

  /**
   * Return true if any image is selected.
   * Sucks because it's a linear search.
   * @returns {boolean}
   */
  // private get hasSelectedFiles(): boolean {
  //
  //   let result: boolean = false;
  //
  //   this.checkboxMap.forEach((val, key, map) => {
  //     if (val.selected) {
  //       result = true;
  //     }
  //   });
  //
  //   return result;
  // }

  /**
   * Query server for images, set to class array.
   */
  private populateUsers(): void {

    // Get users.
    this.users = this.userService.getAll();

    //fileGetOperation.subscribe((result: User[]) => {
    this.users.subscribe((result: User[]) => {
        this.userValues = result;
        // // Set the checkbox map.
        // result.forEach((x) => {
        //   this.checkboxMap.set(x._id, { display: false, selected: false })
        // });
      },
      (err) => {
        this.users = err.message;
        // Log errors if any
        console.log(err);
      });
  }
}
