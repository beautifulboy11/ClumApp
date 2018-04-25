import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { User, Roles } from './user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from "rxjs/Observable";
import { switchMap } from 'rxjs/operator/switchMap';
import 'rxjs/add/observable/of';
import * as _ from 'lodash';
//import { forEach } from '@firebase/util';
export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  user$: BehaviorSubject<User> = new BehaviorSubject(null);
  private fireAuth: any;
  private userData: any;
  userRoles: Array<string>;
 
  constructor(
    private http: HttpClient,
    private af: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.fireAuth = this.af.auth;
    this.af.authState
      .switchMap(auth => {
        if (auth) {
          return this.db.object('/users/' + auth.uid).valueChanges();
        } else {
          return Observable.of(null)
        }
      })
      .subscribe(user => {
        this.user$.next(user);
      });

    this.user$.map(user => {
      return this.userRoles = _.keys(_.get(user, 'roles'));
    }).subscribe();
  }

  getUser(): Observable<any> {
    return Observable.create(observer => {
      let user = this.af.auth.currentUser ? this.af.auth.currentUser : null;
      observer.next(user);
    });
  }

  public doLogin(credentials: Credentials): Observable<any> {
    return Observable.create(observer => {
      this.fireAuth
        .signInWithEmailAndPassword(credentials.email, credentials.password).then((authData) => {
          this.updateUser(authData);
          observer.next(authData);
        }).catch((error) => {
          observer.error(error);
        })
    });
  }

  private updateUser(authData): void {
    const data = new User(authData);
    const ref = this.db.object('users/' + authData.uid);
    ref.valueChanges()
      .take(1)
      .subscribe((user: User) => {
        if (!user) {
          ref.update(data);
        }
      });
  }

  public registerUser(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.af.auth.createUserWithEmailAndPassword(email, password).then(authData => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(newUser => {
            this.db.list('users/' + newUser.uid)
              .push({
                uid: newUser.uid,
                email: email,
                roles: {
                  member: true
                }
              });
          });
        observer.next(authData);
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  public logoutUser(): Promise<any> {
    return this.fireAuth.signOut();
  }

  public resetPassword(email: string): Observable<any> {
    return Observable.create(observer => {
      this.af.auth.sendPasswordResetEmail(email).then((data) => {
        observer.next(data);
      }, function (error) {
        observer.error(error);
      });
    });
  }

  private checkAuthorization(allowedRoles: string[]): boolean {     
    return !_.isEmpty(_.intersection(allowedRoles, this.userRoles))
  }

  public isUser(): boolean {
    const allowed = ['member']
    return this.checkAuthorization(allowed);
  }
  public isAdmin(): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(allowed);
  }
  public isSecurity(): boolean {
    const allowed = ['security']
    return this.checkAuthorization(allowed);
  }
}
