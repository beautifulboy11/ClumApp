import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SignaturePage } from '../pages';
import { DataService } from '../../providers/providers';
import { Member } from '../../models/member';
@IonicPage()
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html'
})
export class MemberDetailPage {
  member: any;
  show: boolean;
  noResults: boolean;
  public signatureImage: any;
  checkins: any = [];
  constructor(private api: DataService, private modalCtrl: ModalController, public navCtrl: NavController, navParams: NavParams) {
    this.member = navParams.get('member');
    this.DidLoad(this.member);
    this.show = true;
    this.noResults = true;
  }

  DidLoad(member: Member) {
    this.api.getLatestCheckin(member.membershipNumber)
      .subscribe(
        resp => {
          this.checkins = [];
          this.show = false;
          resp.map(res => {
            this.noResults = false;
            var ob = {
              date: Date.parse(res.date),
              memberId: res.memberId,
              signature: res.signature,
            }
            this.checkins.push(ob);
          });
        });
  }

  gotoCheckin() {
    let modal = this.modalCtrl.create(SignaturePage, { member: this.member });
    modal.onDidDismiss((item) => {
      this.signatureImage = item;
    });
    modal.present();
  }

  goto(page: string) {
    this.navCtrl.push(page, {member: this.member});
  }

}
