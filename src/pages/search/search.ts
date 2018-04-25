import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import * as _ from 'lodash';
import { Api } from '../../providers/providers';
import { Member } from '../../models/member';


@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})

export class SearchPage {

  currentItems: any = [];
  members: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public api: Api) { }

  ionViewDidLoad() {
    this.api.get('members.json').subscribe(
      resp => { this.currentItems = resp; },
      error => {
        let toast = this.toastCtrl.create({
          position: 'bottom',
          message: error,
          showCloseButton: true,
          cssClass: 'toast-message',
          closeButtonText: 'OK',
          dismissOnPageChange: true
        });
        toast.present();
      }
    );
  }

  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.members = [];
      return;
    }
    this.members = this.query({ firstName: val, lastName: val, membershipNumber: val });
    console.info('**Search Results', this.members);
  }

  query(params?: any) {
    if (!params) {
      return;
    }
    return _.chain(this.currentItems)
      .filter(member => {
        for (let key in params) {
          let field = member[key];
          if (
            _.includes(member,params[key])
            //typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
          ) {
            return member;
          } else if (field == params[key]) {
            return member;
          }
        }
        return null;
      })
      .map(member => {
        let isActive = member.status === 'active';
        let status = isActive ? true : false;
        let chk = status ? 'secondary' : 'dark';
        let name = this.concatenateName(member.firstName, member.lastName);
        console.log('****');
        return {
          About: member.about,
          Club: member.club,
          Contact: member.contact,
          Name: name,
          MemberShipNumber: member.membershipNumber,
          ProfilePic: member.profilePic,
          Status: status,
          Note: member.status,
          Chk: chk
        }
      })
      .value();
  }

  concatenateName(firstname: string, lastname: string): string {
    return firstname + " " + lastname;
  }

  openItem(item: Member) {
    this.navCtrl.push('MemberDetailPage', {
      item: item
    });
  }

}
