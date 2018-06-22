import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { ErrorObservable } from "rxjs/observable/ErrorObservable";
import { timer } from 'rxjs/observable/timer';
import { catchError, retry, shareReplay, switchMap, map, takeUntil } from "rxjs/operators";
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Member } from "../../models/member";
import { Checkin } from "../../models/check-in";
import { MessageService } from "../message-service/message-service";
import { Guest } from "../../models/Guest";
//8009dd7edc5d41619595b7df38d4c554
export interface article {
  author: string;
  description: string;
  publishedAt: string;
  source: { id: string, name: string };
  title: string;
  url: string;
  urlToImage: string;
}
export interface ArticleReponse {
  status: string;
  totalResults: number;
  articles: Array<article>;
}
const API_ENDPOINT = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=8009dd7edc5d41619595b7df38d4c554';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;
@Injectable()
export class DataService {
  members: any;
  maxCheckin: any;
  private cache$: Observable<Array<article>>;
  private reload$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private afs: AngularFirestore
  ) { }

  get getGoogleNews() {
    if (!this.cache$) {
      const timer$ = timer(0, REFRESH_INTERVAL);
      this.cache$ = timer$.pipe(
        switchMap(_ => this.getNews()),
        takeUntil(this.reload$),
        shareReplay(CACHE_SIZE));
    }  
    return this.cache$;
  }

  forceReload() {
    this.reload$.next();
    this.cache$ = null;
  }

  private getNews() {
    return this.http.get<ArticleReponse>(API_ENDPOINT).pipe(     
      map(response => response.articles));
  }

  getMemberCollection(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    return Observable.create(observer => {
      return this.afs.collection(endpoint)
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

  post(endpoint: string, body: any): any {
    return Observable.create(observer => {
      return this.afs
        .doc(endpoint)
        .set(body)
        .then(value => {
          return observer.next(value);
        });
    });
  }

  postCheckin(checkinRec: Checkin): any {
    return Observable.create(observer => {
      return this.afs
        .doc(`checkins/${checkinRec.memberId}`)
        .collection('my-checkins')
        .add({
          date: checkinRec.date,
          memberId: checkinRec.memberId,
          signature: checkinRec.signature
        })
        .then(value => {
          return observer.next(value);
        });
    });
  }

  postGuestCheckin(membershipNumber: string, guests: Array<Guest>): Observable<any> {
    return Observable.create(observer => {
      return this.afs
        .doc(`checkins/${membershipNumber}`)
        .collection('guests')
        .doc(`${new Date().getFullYear()}-${(new Date().getMonth() + 1)}`)
        .set({
          guests
        })
        .then(value => {
          return observer.next(value);
        });
    });
  }

  getLatestCheckin(membershipNumber: string): any {
    return this.afs.doc(`checkins/${membershipNumber}`)
      .collection('my-checkins', ref => ref.orderBy('date', 'desc').limit(1)).valueChanges();
  }

  getPreviousCheckins(membershipNumber: any) {
    return this.afs.doc(`checkins/${membershipNumber}`)
      .collection('my-checkins', ref => {
        return ref.orderBy('date', 'desc')
      })
      .valueChanges();

  }

  getPreviousGuestCheckins(membershipNumber: any, date: string) {
    return this.afs
      .doc(`checkins/${membershipNumber}`)
      .collection('guests')
      .doc(`/${date}`)
      .valueChanges();
  }


  getDocument(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    return Observable.create(observer => {
      return this.afs.doc(endpoint)
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

  getCollection(endpoint: string, params?: any, reqOpts?: any): Observable<any> {
    return Observable.create(observer => {
      return this.afs.collection(endpoint)
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

  getEventCollection(): Observable<any> {
    return Observable.create(observer => {
      return this.afs.collection(`events`, ref => { return ref.where('startDate', '>=', new Date().toDateString()) })
        .valueChanges()
        .pipe(
          retry(3),
          catchError(this.handleError)
        )
        .subscribe((res) => {
          return observer.next(res);
        },
          error => {
            this.messageService.add(error);
          }
        );
    });
  }

  createEvent(title: string, location: string, description: string, startDate: string, endDate: string): Observable<any> {
    return Observable.create(observer => {
      var id = this.afs.createId();
      return this.afs.doc(`events/${id}`).set({
        title,
        location,
        description,
        startDate,
        endDate
      }).then((res) => {
        return observer.next(res);
      })
    })
  }

  getMaxCheckInLock(): Observable<any> {
    return this.afs
      .collection('maxCheckin')
      .valueChanges();
  }

  getMemberCheckins(member: any): Observable<Member> {
    return Observable.create(observer => {
      return this.afs
        .collection(`checkins/${member.membershipNumber}`, ref => {
          return ref.orderBy("date")
        })
        .valueChanges()
        .subscribe(res => {
          return observer.next(res);
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
  }

  concatenateName(firstname: string, lastname: string): string {
    return firstname + " " + lastname;
  }

  handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      alert("An error occurred:" + error.error.message);
    } else {
      alert(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return new ErrorObservable();
  }
}
