import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';

@IonicPage()
@Component({
  selector: 'page-add-event',
  templateUrl: 'add-event.html',
})
export class AddEventPage {
  event = { title: "", location: "", message: "", startDate: "", endDate: "" };

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private calendar: Calendar) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddEventPage');
  }
  closeModal() {
    this.viewCtrl.dismiss()
  }
  save() {
    //use promise to show appropriate messages
    this.calendar
      .createEvent(this.event.title, this.event.location, this.event.message, new Date(this.event.startDate), new Date(this.event.endDate))
      .then(
        (msg) => {
          let alert = this.alertCtrl.create({
            title: 'Success!',
            subTitle: 'Event saved successfully',
            buttons: ['OK']
          });
          alert.present();
          //this.navCtrl.pop();
        },
        (err) => {
          let alert = this.alertCtrl.create({
            title: 'Failed!',
            subTitle: err,
            buttons: ['OK']
          });
          alert.present();
        }
      );
  }


}
