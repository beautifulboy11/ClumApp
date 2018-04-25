import { Component } from '@angular/core';
import { ViewController, ModalController, NavController, AlertController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { SignaturePage, MemberDetailPage } from '../pages';
import { Member } from '../../models/member';

import { AuthService } from '../../providers/providers';
@Component({
  selector: 'page-popover',
  template: `
  <ion-list>
    <ion-list-header>What would you like to do?</ion-list-header>  
    <button ion-item (click)="openMemberDetails(member)">Details</button>
    <button ion-item (click)="showCheckin(member)" *ngIf="authService.isSecurity()">Checkin</button>
    <button ion-item (click)="close()">Cancel</button>
    <button ion-item (click)="showConfirm(member)" *ngIf="authService.isAdmin()">Delete</button>
  </ion-list>
`
})

export class PopoverPage {
  member: any;
  membersRef: AngularFireList<any>;
  public signatureImage: any;
  
  constructor(public viewCtrl: ViewController,
     private alertCtrl: AlertController, 
     private authService: AuthService,
     public db: AngularFireDatabase, public modalCtrl: ModalController, public navParams: NavParams, public navCtrl: NavController) {
    this.membersRef = db.list('members');
    this.member = navParams.get('member');   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  openMemberDetails(member: Member) {
    console.log('***navParams', member);
    this.navCtrl.push(MemberDetailPage, {
      member: member
    });
  }


  showCheckin(member: any) {
    let modal = this.modalCtrl.create(SignaturePage,{member: member});
    modal.onDidDismiss((item) => {
      this.signatureImage = item;
      console.log(this.signatureImage);
    });
    modal.present();
  }

  showConfirm(item) {
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to Delete this record?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Agree clicked');
            this.removeMember(item);
          }
        }
      ]
    });
    confirm.present();
  }

  removeMember(item) {
    this.membersRef.remove(item.name).then((res) => {
      let alert = this.alertCtrl.create({
        title: 'Delete Member',
        message: 'Member Removed Successfully!' + res,
        buttons: ['Ok'],
      });
      alert.present();
    }).catch((error) => {
      let alert = this.alertCtrl.create({
        title: 'Delete Member',
        message: 'Member Removed Successfully!' + error,
        buttons: ['Ok'],
      });
      alert.present();
    });
  }

}
