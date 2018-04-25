import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController, LoadingController, PopoverController, ToastController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { PopoverPage, MemberDetailPage } from '../pages';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';
import { Network } from '@ionic-native/network';
import { AuthService } from '../../providers/providers';
import { Member } from '../../models/member';
import * as _ from 'lodash';
import { User } from '../../providers/authentication-service/user';
@IonicPage()
@Component({
  selector: 'page-member',
  templateUrl: 'member.html'
})

export class MemberPage {

  club: any;
  membersRef: AngularFireList<any>;
  members: any = [];
  mufMembers: any = [];
  loading: any;
  public signatureImage: any;
  profileUrl: Observable<string | null>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  disconnectSubscription: any;
  connectSubscription: any

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    public db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private network: Network
  ) {

    this.club = 'Nkana';
    this.membersRef = db.list<Member>('members');
    //const ref = this.storage.ref('users/davideast.jpg');
    //this.profileUrl = ref.getDownloadURL();    
  }

  ionViewDidEnter() {
    //TODO check Network connection 
    //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
    //this.network.onchange().subscribe(() => {});    
    //this.network.onConnect().subscribe(data => console.log('network connected!', data), error => console.log('network connected!', error));

    //this.network.onDisconnect().subscribe(data => console.log('network was disconnected', data), error => console.log(error));
  }

  ionViewDidLoad() {
    this.loadMembers();
    console.log("**Admin", this.authService.isAdmin());
  }

  loadMembers(): any {
    this.loading = this.loadingCtrl.create({
      content: 'Loading...',
      spinner: 'bubbles',
      showBackdrop: false,
    });

    this.loading.present().then(() => {
      this.membersRef.valueChanges().subscribe(
        res => {
          this.members = [];
          this.mufMembers = [];
          res.forEach(resp => {
            if (resp.club === 'Nkana') {
              this.members.push(resp);
            } else {
              this.mufMembers.push(resp)
            }
          });
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss().then(() => {
            this.toastCtrl.create({
              position: 'bottom',
              message: error.message,
              showCloseButton: true,
              cssClass: 'toast-message',
              closeButtonText: 'Dismiss',
              dismissOnPageChange: true
            }).present();
          });
        }
      );
    });
  }

  showPopOver($event, member: any) {
    let popover = this.popoverCtrl.create(PopoverPage, { member: member });
    popover.present({
      ev: $event,
    });
  }

  addMember() {
    let addModal = this.modalCtrl.create('MemberCreatePage');
    addModal.onDidDismiss(member => {
      if (member) {
        this.membersRef.push(member);
      }
    })
    addModal.present();
  }

  openMemberDetails(member: any) {
    this.navCtrl.push(MemberDetailPage, {
      member: member
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'name-your-file-path-here';
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    // get notified when the download URL is available
    this.uploadPercent = task.percentageChanges();
    this.downloadURL = task.downloadURL();
  }
}
