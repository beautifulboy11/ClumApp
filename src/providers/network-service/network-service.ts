import { Injectable } from "@angular/core";
import { Network } from "@ionic-native/network";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NetworkService {

  constructor(public network: Network) {}

  get(): any {
    return Observable.create(observer => {
      return this.network.onchange()
        .subscribe(
          (res) => {
            return observer.next(res);
          },
          error => { }
        );
    });

  }

}
