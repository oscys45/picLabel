import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';
import { ServiceInterface } from './service-interface';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Injectable()
export class UserService implements ServiceInterface {

  /**
   * Constructor
   * @param {Router} router
   * @param {HttpClient} http
   */
  constructor(private router: Router,
              private authService: AuthService,
              private http: HttpClient) { }

  /**
   * Insert single user to database.
   * @param {Jpeg} file
   * @returns {Observable<T>}
   */
  public add<T>(user: User): Observable<T> {

    return this.http.post(environment.API_Endpoint + "/authenticate/register",
      user,
      { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });
  }

  /**
   * Update single user in database
   * @param {Jpeg} file
   */
  public update(user: User): void {

    let userOperation = this.http.put(environment.API_Endpoint + "/user/" + user._id,
      user,
      { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });

    userOperation.subscribe(
      (result: any) => {
        console.log(result);
      },
      (err) => {
        // Log errors if any
        console.log(err);
      });
  }

  /**
   * Get all the users.
   * @returns {Observable<T>}
   */
  public getAll<T>(): Observable<T> {

    return this.http.get(environment.API_Endpoint + "/user",
      { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });
  }
}
