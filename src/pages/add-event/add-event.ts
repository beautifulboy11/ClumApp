import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { DataService } from '../../providers/providers';

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
    private api: DataService
  ) {
  }

  closeModal() {
    this.viewCtrl.dismiss()
  }
  save() {
    if (this.event.title != null) {
      this.api
        .createEvent(this.event.title, this.event.location, this.event.message, new Date(this.event.startDate).toDateString(), new Date(this.event.endDate).toDateString())
        .subscribe(
          (msg) => {
            if (msg) {
              this.alertCtrl.create({
                title: 'Success!',
                subTitle: 'Event saved successfully',
                buttons: ['OK']
              }).present();
            }
          },
          (err) => {
            this.presentError(err);
          });
    }else{
      this.presentError('An Event requires a title');
    }
  }

  presentError(err: string) {
    this.alertCtrl.create({
      title: 'Failed!',
      subTitle: err,
      buttons: ['OK']
    }).present();
  }
}
