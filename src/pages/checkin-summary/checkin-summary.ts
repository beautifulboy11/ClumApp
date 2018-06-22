import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Member } from '../../models/member';
import { DataService } from '../../providers/providers';

@IonicPage()
@Component({
  selector: 'page-checkin-summary',
  templateUrl: 'checkin-summary.html',
})
export class CheckinSummaryPage {
  member: Member;
  allCheckins: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private api: DataService) {
    this.member = navParams.get('member');
  }

  ionViewDidLoad() {   
    this.api.getMemberCheckins(this.member).subscribe(res => {
      this.allCheckins = res;
    })
  }

}
