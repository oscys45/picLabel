import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable()
export class AuthService {

  /**
   * Constructor
   * @param {Router} router
   * @param {HttpClient} http
   */
  constructor(private router: Router, private http: Http) { }

  /**
   *  Login, get auth token, set it to local storage.
   * @param credentials
   */
  public login(credentials: User): Promise<User> {

    let authOperation: Promise<Response> = this.http.post(environment.API_Endpoint + "/authenticate", credentials).toPromise<Response>();

    return authOperation.then((response: Response) => {
              if (response.status == 200) {
                let result = response.json();
                if (result && result.token) {
                  localStorage.setItem('token', result.token);
                }
                return this.userProfile;
              }
              if (response.status == 401) {
                let result = response.json();
                console.log(result);
              }
            })
            .catch((err) => {
              // Log errors if any
              console.log(err);
              //throw err;
              return err;
            });
  }

  /**
   * Log off (remove local storage token, go home)
   */
  public logout(): void {

    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  /**
   * Returns true if user is authenticated (an unexpired token exists).
   * @returns {boolean}
   */
  public get isAuthenticated(): boolean {
    return tokenNotExpired('token');
  }

  /**
   * Returns true if user is authenticated (an unexpired token exists).
   * @returns {boolean}
   */
  public get isAdministrator(): boolean {

    if (!this.userProfile) {
      return false;
    }
    return this.userProfile.roles.find((x) =>  x == "Administrator") ? true : false;
  }

  /**
   * Decode local storage token and return the user.
   * @returns {User}
   */
  public get userProfile(): User {

    let tokenHelper = new JwtHelper();

    return <User>tokenHelper.decodeToken(localStorage.getItem('token')).user;
  }

  /**
   * Return raw local storage token.
   * @returns {User}
   */
  public get userToken(): string {
    return localStorage.getItem('token');
  }

}
