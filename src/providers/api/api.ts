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
  members: Member[] = [];
  private maxCheckin: number;
  private url: string = "https://boating-manager.firebaseio.com";

  constructor(public http: HttpClient, private db: AngularFireDatabase) { }

  getPreviousCheckins(membershipNumber: any) {
    return Observable.create(q => {
      return this.db
        .list('/checkins/' + membershipNumber, ref =>
          ref.orderByChild("memberId")
            .equalTo(membershipNumber)).valueChanges()
        .subscribe(
          (res) => {
            return q.next(res);
          },
          error => { }
        );
    });
  }

  getMembers() {
    return Observable.create(observer => {
      return this.db
        .list<Member>("/members")
        .valueChanges()
        .subscribe(
          res => {
            this.members = res;
            return observer.next(res);
          },
          error => {
            //error;
          }
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

  getMemberCheckins(member: any): Observable<CheckIn> {
    return Observable.create(observer => {
      return this.db.list('/checkins/' + member.membershipNumber, ref =>
        ref.orderByChild("memberId").equalTo(member.membershipNumber)
      ).valueChanges().subscribe(res => {
        return observer.next(res);
      });
    });
  }

  getLatestCheckin(membershipNumber: string): any {
    return Observable.create(observer => {
      return this.db.list('/checkins/' + membershipNumber, ref => ref.orderByChild('memberId')
        .equalTo(membershipNumber).limitToLast(1))
        .valueChanges()
        .subscribe(data => {
          return observer.next(data);
        });
    });
  }

  postCheckin(checkinRec: CheckIn): any {
    return Observable.create(observer => {
      return this.db
        .list('checkins/' + checkinRec.memberId)
        .push({
          date: checkinRec.date,
          memberId: checkinRec.memberId,
          signature: checkinRec.signature
        }).then((value) => {
          return observer.next(value);
        });
    });
  }

  postGuestCheckin(membershipNumber: string, guests: string[]): any {
    try {
      this.db
        .list('guests/' + membershipNumber + "/" + new Date().getFullYear() + "/" + new Date().getMonth() + 1)
        .push({
          guests
        }).then((value) => {
          return value;
        });
    } catch (error) { }
  }

  query(params?: any) {
    if (!params) {
      return this.members;
    }

    return this.members.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  get(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
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
      .get(`${this.url}/${endpoint}`, reqOpts);

       //.pipe(retry(3), catchError());
  }

  public post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + "/" + endpoint, body, reqOpts);
  }

  public put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + "/" + endpoint, body, reqOpts);
  }

  public delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + "/" + endpoint, reqOpts);
  }

  public patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + "/" + endpoint, body, reqOpts);
  }

  // private handleError(error: HttpErrorResponse) {

  //   if (error.error instanceof ErrorEvent) {
  //     console.log("An error occurred:" + error.error.message);
  //   } else {
  //     console.log(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
  //   }
  //   //return new ErrorObservable("Connection Error; Check connection & try again later.");
  // }
}
