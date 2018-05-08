import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders
} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import "rxjs/add/operator/map";
import { catchError, retry, max } from "rxjs/operators";
import { AngularFireDatabase } from "angularfire2/database";
import { CheckIn } from "../../models/check-in";
import { Member } from "../../models/member";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "my-auth-token"
  })
};

@Injectable()
export class Api {
  private maxCheckin: number;
  public members: any;
  private url: string = "https://boating-manager.firebaseio.com";

  constructor(public http: HttpClient, private db: AngularFireDatabase) {}

  getMembers() {
    return Observable.create(observer => {
      return this.db
        .list<Member>("members")
        .valueChanges()
        .subscribe(
          res => {
            this.members = res;
            return observer.next(res);
          },
          error => {}
        );
    });
  }

  getMaxCheckInLock(): Observable<any> {
    return Observable.create(observer => {
      var res = this.db
        .list("maxCheckin")
        .valueChanges()
        .subscribe(data => {
          data.map(result => {
            return observer.next(result);
          });
        });
    });
  }

  getCheck_Ins(member: any): Observable<CheckIn> {
    return Observable.create(observer => {
      var res = this.db.list("/checkins", ref =>
        ref.orderByChild("memberId").equalTo(member.membershipNumber)
      );
      return observer.next(res);
    });
  }

  public get(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http
      .get(`${this.url}/${endpoint}`, reqOpts)
      .pipe(retry(3), catchError(this.handleError));
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + "/" + endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + "/" + endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + "/" + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + "/" + endpoint, body, reqOpts);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.// The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return new ErrorObservable(
      "Connection Error; Check connection & try again later."
    );
  }
}
