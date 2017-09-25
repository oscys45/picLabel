import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';
import { Jpeg } from '../models/jpeg';

@Injectable()
export class FileService {

  /**
   * Constructor
   * @param {AuthService} authService
   * @param {HttpClient} http
   */
  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  /** Insert single file to database.
   *
   * @param {Jpeg} file
   * @returns {Observable<T>}
   */
  public pushFile<T>(file: Jpeg): Observable<T> {

    return this.http.post(environment.API_Endpoint + "/file",
                          file,
                  { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });
  }

  /**
   * Update single file in database
   * @param {Jpeg} file
   */
  public updateFile(file: Jpeg): void {

    let fileOperation = this.http.put(environment.API_Endpoint + "/file/" + file._id,
                                      file,
                                      { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });

    fileOperation.subscribe(
      (result: any) => {
        console.log(result);
      },
      (err) => {
        // Log errors if any
        console.log(err);
      });
  }

  /**
   * Get all this user's files.
   * @returns {Observable<T>}
   */
  public getAllFiles<T>(): Observable<T> {

    return this.http.get(environment.API_Endpoint + "/file/users/" + this.authService.userProfile._id,
                    { headers: new HttpHeaders().set("Authorization", "JWT " + this.authService.userToken) });
  }
}
