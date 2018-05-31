import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { Guest } from '../../models/Guest';

@IonicPage()
@Component({
  selector: 'page-guest-checkin',
  templateUrl: 'guest-checkin.html',
})
export class GuestCheckinPage {
  guest = new Guest("", "", "");
  guests: Array<Guest> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) { }

  logForm() {
    console.log(this.guest)
    this.guests.push(this.guest);
    this.guest = new Guest("", "", "");
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done() {
    if (this.guests.length === 0) { return; }
    this.viewCtrl.dismiss(this.guests);
  }
}
