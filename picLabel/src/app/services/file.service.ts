import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { AuthService } from '../services/auth.service';
import { Jpeg } from '../models/jpeg';

@Injectable()
export class FileService {

  constructor(private authService: AuthService,
              private http: HttpClient) {
  }

  public pushFile<T>(file: Jpeg): Observable<T> {

    return this.http.post(environment.API_Endpoint + "/file", file);
    // let fileOperation = this.http.post(environment.API_Endpoint + "/file", file);
    //
    // fileOperation.subscribe(
    //   (result: any) => {
    //     console.log(result);
    //   },
    //   (err) => {
    //     // Log errors if any
    //     console.log(err);
    //   });
  }

  public updateFile(file: Jpeg): void {

    let fileOperation = this.http.put(environment.API_Endpoint + "/file/" + file._id, file);

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

    return this.http.get(environment.API_Endpoint + "/file/users/" + this.authService.userProfile._id);
  }
}
