import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { DomSanitizer } from '@angular/platform-browser';
@IonicPage()
@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html'
})
export class MemberDetailPage {
  member: any;
  checkinRef: AngularFireList<any>;
  checkins: any = [];
  constructor(public navCtrl: NavController, public db: AngularFireDatabase, navParams: NavParams) {
    this.member = navParams.get('member');
    this.checkinRef = this.db.list('/checkins', ref => ref.orderByChild('memberId').equalTo(this.member.membershipNumber));
  }
  ionViewDidLoad() {
    this.checkinRef.valueChanges().subscribe(
      resp => {
        // console.log('**checkins', resp); 
        resp.map(res => { 
         var ob =  {
           date: Date.parse(res.date),
           memberId: res.memberId,
           signature: res.signature,
          }
          this.checkins.push(ob);
         });
      });
      
  }

}
