import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, AlertController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
})
export class SignaturePage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = { 'minWidth': 2, 'canvasWidth': 340, 'canvasHeight': 200 };
  public signatureImage: string;
  public member: any;
  public prevCheckin: any = [];
  public checkinRef: AngularFireList<any>;
  public MaxcheckinRef: AngularFireList<any>;
  public previousCheckin: AngularFireList<any>;
  public maxAllowed: number;
  public loading: any;
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.member = navParams.get('member');
    console.info('**Signature ', this.member);
    this.checkinRef = db.list('checkins');
    this.MaxcheckinRef = db.list('maxCheckin');
    this.previousCheckin = this.db.list('/checkins', ref => ref.orderByChild('memberId').equalTo(this.member.membershipNumber));
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }


  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      spinner: 'circles',
      showBackdrop: false,
    });

    this.loading.present().then(() => {
      this.MaxcheckinRef.valueChanges().subscribe(data => {
        data.map(result => {
          this.maxAllowed = result;
          console.log('**Max Allowed', this.maxAllowed);
        });
      });

      this.previousCheckin.valueChanges().subscribe(
        resp => {
          resp.map(res => {
            var ob = {
              mon: this.getMonthFromDate(res.date),
              year: this.getYearFromDate(res.date),
              memberId: res.memberId,
            }
            this.prevCheckin.push(ob);
          });
          this.checkCheckins();
        });
    });
  }

  checkCheckins() {
    let matcheddates = [];
    this.prevCheckin.forEach(element => {
      if (element.mon === (new Date()).getMonth() + 1 && element.year === (new Date()).getFullYear()) {
        matcheddates.push(element);
      }
    });

    var isMax = matcheddates.length < this.maxAllowed ? true : false;

    if (isMax) {
      this.loading.dismiss();
    } else {
      this.loading.dismiss();
      this.presentToast();
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: `You have used up ${this.maxAllowed} checkin this month`,
      duration: 4000,
      position: 'top',
      showCloseButton: true,
      dismissOnPageChange: true,
      closeButtonText: 'OK'
    });

    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });

    toast.present();
  }
  
  getYearFromDate(date: string): number {
    let d = new Date(date);
    var m = d.getFullYear();
    return m;
  }

  getMonthFromDate(date: string): number {
    let d = new Date(date);
    var m = d.getMonth() + 1;
    return m;
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    this.canvasResize();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  save() {
    this.signatureImage = this.signaturePad.toDataURL();
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    this.checkinRef.push({
      date: date,
      memberId: this.member.membershipNumber,
      signature: this.signatureImage
    });
    this.showSuccess();
  }

  drawClear() {
    this.signaturePad.clear();
  }

  showSuccess() {
    let confirm = this.alertCtrl.create({
      title: 'Success',
      message: 'You have successfully checked in this user',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('Agree clicked');
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}
