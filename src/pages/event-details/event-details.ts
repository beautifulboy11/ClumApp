import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
 event: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.event = navParams.data;
  }

  ionViewDidLoad() {   
  }

}
