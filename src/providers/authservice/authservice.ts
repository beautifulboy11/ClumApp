import { Injectable } from "@angular/core";
import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from "./user";

import { Observable, of, BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";

import * as _ from "lodash";
export interface Credentials {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  user$: BehaviorSubject<User> = new BehaviorSubject(null);
  authState: any;
  userRoles: Array<string>;
  userSite: string;
  user: Observable<User>;
  constructor(private auth$: AngularFireAuth, private db: AngularFireDatabase,
    private afs: AngularFirestore) {
    auth$.authState.subscribe(state => {
      this.authState = state;
    });
    this.initService();
  }

  initService() {
   this.user = this.auth$.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges()       
        } else {
          return of(null)
        }
      }))
      this.user.subscribe(user => {
        this.user$.next(user);
      });
          
    this.user$
      .map(user => {
        this.userSite = _.get(user, "site");       
        return (this.userRoles = _.keys(_.get(user, "roles")));
      })
      .subscribe();
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.auth$.user : null;
  }

  getUser(): Observable<any> {
    return Observable.create(observer => {
      let user = this.auth$.auth.currentUser ? this.auth$.auth.currentUser : null;
      observer.next(user);
    });
  }

  isAuthenticated(): Observable<any> {
    return this.auth$.authState;
  }

  doLogin(credentials: Credentials): Observable<any> {
    return Observable.create(observer => {
      this.auth$.auth
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then((user) => {
          this.authState = user;
          observer.next(user);
          this.updateUser(user);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  private updateUserData(authData): void {
    const data = new User(authData.user);
    const ref = this.db.object(`users/${data.uid}`);
    ref
      .valueChanges()
      .take(1)
      .subscribe((user: User) => {
        if (!user) {
          ref.update(data);
        }
      });
  }

  private updateUser(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data = new User(user.user);

    return userRef.set(data, { merge: true })

  }

  public registerUser(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.auth$.auth
        .createUserWithEmailAndPassword(email, password)
        .then(authData => {
          this.auth$
            .auth
            .createUserWithEmailAndPassword(email, password)
            .then(newUser => {
              this.afs.doc("users/" + newUser.uid).set({
                uid: newUser.uid,
                email: email,
                roles: {
                  member: true
                },
                photoURL: '',
                displayName: ''
              });
            });
          observer.next(authData);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  public signOut(): Promise<any> {
    return this.auth$.auth.signOut();
  }

  public resetPassword(email: string): Observable<any> {
    return Observable.create(observer => {
      this.auth$.auth.sendPasswordResetEmail(email).then(
        data => {
          observer.next(data);
        },
        function (error) {
          observer.error(error);
        }
      );
    });
  }

  private checkAuthorization(allowedRoles: string[]): boolean {
    return !_.isEmpty(_.intersection(allowedRoles, this.userRoles));
  }

  public isUser(): boolean {
    const allowed = ["member"];
    return this.checkAuthorization(allowed);
  }
  public isAdmin(): boolean {
    const allowed = ["admin"];
    return this.checkAuthorization(allowed);
  }
  public isSecurity(): boolean {
    const allowed = ["security"];
    return this.checkAuthorization(allowed);
  }

  public uSite(): Observable<any[]> {
    return Observable.create(observer => {
      return observer.next(this.userSite);
    });
  }
}
