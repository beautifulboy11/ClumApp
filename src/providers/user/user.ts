import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  login(accountInfo: any) {
    let seq = this.api.post('login', accountInfo).share();

    seq.subscribe((res: any) => {     
      if (res.status == 'success') {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {      
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    },
     err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  logout() {
    this._user = null;
  }

 
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
