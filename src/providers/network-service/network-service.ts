import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Network } from "@ionic-native/network";
/*
  Generated class for the NetworkServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkService {
  connectionStatus: any;
  constructor(public network: Network) {
    this.connectionStatus = this.network.type;
  }

  NetworkCheck(): any {
    //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
    this.network.onchange().subscribe(() => {

      this.network.onConnect().subscribe(
        data => {          
          console.log("network connected!");
          if (this.network.type === 'wifi') {
            console.log('we got a wifi connection, woohoo!');
          }
        },
        error => {
          console.log("network connection Error!", error);
        });

      this.network.onDisconnect().subscribe(
        data => {          
          console.log("network was disconnected", data);
        },
        error => {
          console.log(error);
        }
      );
    });


  }
}
