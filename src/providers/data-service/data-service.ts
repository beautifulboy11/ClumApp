import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import "rxjs/add/operator/map";
import { catchError, retry, max } from "rxjs/operators";
import { AngularFireDatabase } from "angularfire2/database";
import { Member } from "../../models/member";
import { Checkin } from "../../models/check-in";
import { MessageService } from "../message-service/message-service";
import { Guest } from "../../models/Guest";

@Injectable()
export class DataService {
  members: any;
  maxCheckin: any;
  private url: string = "https://boating-manager.firebaseio.com";

  constructor(
    private http: HttpClient,
    private db: AngularFireDatabase,
    private messageService: MessageService
  ) { }

  post(endpoint: string, body: any): any {
    return Observable.create(observer => {
      return this.db
        .object(endpoint)
        .set(body)
        .then(value => {
          return observer.next(value);
        });
    });
  }

  postCheckin(checkinRec: Checkin): any {
    return Observable.create(observer => {
      return this.db
        .list("checkins/" + checkinRec.memberId)
        .push({
          date: checkinRec.date,
          memberId: checkinRec.memberId,
          signature: checkinRec.signature
        })
        .then(value => {
          return observer.next(value);
        });
    });
  }

  postGuestCheckin(
    membershipNumber: string,
    guests: Array<Guest>
  ): Observable<any> {
    return Observable.create(observer => {
      return this.db
        .list(
          "guests/" +
          membershipNumber +
          "/" +
          new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1)
        )
        .push({
          guests
        })
        .then(value => {
          return observer.next(value);
        });
    });
  }

  get(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    // if (!reqOpts) {
    //   reqOpts = {
    //     params: new HttpParams()
    //   };
    // }
    if (params) {
    }

    return Observable.create(observer => {
      return this.db
        .list(endpoint)
        .valueChanges()
        .pipe(
          retry(3),
          catchError(this.handleError)
        )
        .subscribe(
          res => {
            if (reqOpts) {
              this.members = res;
            }
            return observer.next(res);
          },
          error => {
            this.messageService.add(error);
          }
        );
    });
  }

  getPreviousCheckins(membershipNumber: any) {
    return Observable.create(q => {
      return this.db
        .list("/checkins/" + membershipNumber, ref =>
          ref.orderByChild("memberId").equalTo(membershipNumber)
        )
        .valueChanges()
        .subscribe(
          res => {
            return q.next(res);
          },
          error => { }
        );
    });
  }

  getMaxCheckInLock(): Observable<any> {
    return Observable.create(observer => {
      if (this.maxCheckin != null) {
        return of(this.maxCheckin);
      }
      return this.db
        .list("maxCheckin")
        .valueChanges()
        .subscribe(data => {
          this.maxCheckin = data;
          data.map(result => {
            return observer.next(result);
          });
        });
    });
  }

  getMemberCheckins(member: any): Observable<Member> {
    return Observable.create(observer => {
      return this.db
        .list("/checkins/" + member.membershipNumber, ref =>
          ref.orderByChild("memberId").equalTo(member.membershipNumber)
        )
        .valueChanges()
        .subscribe(res => {
          return observer.next(res);
        });
    });
  }

  getLatestCheckin(membershipNumber: string): any {
    return Observable.create(observer => {
      return this.db
        .list("/checkins/" + membershipNumber, ref =>
          ref
            .orderByChild("memberId")
            .equalTo(membershipNumber)
            .limitToLast(1)
        )
        .valueChanges()
        .subscribe(data => {
          return observer.next(data);
        });
    });
  }

  query(params?: any) {
    if (!params) {
      return this.members;
    }

    return this.members.filter(item => {
      for (let key in params) {
        let field = item[key];
        if (
          typeof field == "string" &&
          field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
        ) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });

    //.map(member => {
    //   let isActive = member.status === "active";
    //   let status = isActive ? true : false;
    //   let chk = status ? "secondary" : "dark";
    //   let name = this.concatenateName(member.firstName, member.lastName);
    //   return {
    //     About: member.about,
    //     Club: member.club,
    //     Contact: member.contact,
    //     Name: name,
    //     MemberShipNumber: member.membershipNumber,
    //     ProfilePic: member.profilePic,
    //     Status: status,
    //     Note: member.status,
    //     Chk: chk
    //   };
    // });
  }

  concatenateName(firstname: string, lastname: string): string {
    return firstname + " " + lastname;
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

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log("An error occurred:" + error.error.message);
    } else {
      console.log(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return new ErrorObservable();
  }
}
