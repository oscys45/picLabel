import { Observable } from 'rxjs/Observable';

export interface ServiceInterface {
  //currentTime: Date;
  add<T>(object: any): Observable<T>;
  update(user: any): void;
  getAll<T>(): Observable<T>;
}
