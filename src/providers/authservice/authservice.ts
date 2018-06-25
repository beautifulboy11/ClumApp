import { Injectable } from "@angular/core";
//import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable, of, BehaviorSubject } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { User } from "./user";
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
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    afAuth.authState.subscribe(state => {
      this.authState = state;
    });
    this.initService();
  }

  initService() {
    this.user = this.afAuth.authState.pipe(
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

    this.user$.pipe(map(user => {
      this.userSite = _.get(user, "site");
      return (this.userRoles = _.keys(_.get(user, "roles")));
    }))
      .subscribe();
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }
  get currentUser(): any {
    return this.authenticated ? this.afAuth.user : null;
  }

  getUser(): Observable<any> {
    return Observable.create(observer => {
      let user = this.afAuth.auth.currentUser ? this.afAuth.auth.currentUser : null;
      return observer.next(user);
    });
  }

  isAuthenticated(): Observable<any> {
    return this.afAuth.authState;
  }

  doLogin(credentials: Credentials): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .signInWithEmailAndPassword(credentials.email, credentials.password)
        .then((authCrendential) => {
          this.authState = authCrendential;
          observer.next(authCrendential);
          this.updateUserData(authCrendential.user);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  // private updateUserData(authData): void {
  //   const data = new User(authData.user);
  //   const ref = this.db.object(`users/${data.uid}`);
  //   ref
  //     .valueChanges()
  //     .take(1)
  //     .subscribe((user: User) => {
  //       if (!user) {
  //         ref.update(data);
  //       }
  //     });
  // }

  private updateUserData(user) {   
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data: User = {
      uid: user.uid,
      email: user.email,
      roles: {
        member: true
      }      
    };
    return userRef.set(data, { merge: true })
  }

  public registerUser(email: string, password: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
          this.afs.doc("users/" + userCredential.user.uid).set({
            uid: userCredential.user.uid,
            email: email,
            roles: {
              member: true
            },
            photoURL: '',
            displayName: ''
          });
          return observer.next(userCredential.user);
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }

  public signOut(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  public resetPassword(email: string): Observable<any> {
    return Observable.create(observer => {
      this.afAuth.auth.sendPasswordResetEmail(email).then(
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

  private checkAuthorisation(user: User, allowedRoles: string[]): boolean {
    if(!user) return false;
    for(const role of allowedRoles){
      if(user.roles[role]){
        return true;
      }
    }
    return false;
  }

  public iSecurity(user: User): boolean {
    const allowed = ["security"];
    return this.checkAuthorisation(user, allowed);
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
