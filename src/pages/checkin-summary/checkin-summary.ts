import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Member } from '../../models/member';
import { Api } from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-checkin-summary',
  templateUrl: 'checkin-summary.html',
})
export class CheckinSummaryPage {
  member: Member;
  allCheckins: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private api: Api) {
    this.member = navParams.get('member');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckinSummaryPage');
    this.api.getMemberCheckins(this.member).subscribe(res => {
      this.allCheckins = res;
    })
  }

}
