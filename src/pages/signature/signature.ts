import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  ViewController,
  AlertController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Api } from "../../providers/api/api";
import { DateWorker } from "../../providers/date-worker/date-worker";

@Component({
  selector: "page-signature",
  templateUrl: "signature.html"
})
export class SignaturePage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 340,
    canvasHeight: 200
  };

  public signatureImage: string;
  public member: any;
  public prevCheckin: any = [];
  public checkinRef: AngularFireList<any>;
  public MaxcheckinRef: AngularFireList<any>;
  public previousCheckin: any = [];
  public maxAllowed: number;
  public loading: any;
  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private api: Api,
    private dateWorker: DateWorker,
    public navParams: NavParams,
    public db: AngularFireDatabase,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.member = navParams.get("member");
    this.api.getPreviousCheckins(this.member.membershipNumber).subscribe(
      res => {
        this.previousCheckin = res;
      },
      error => { }
    );
  }

  canvasResize() {
    let canvas = document.querySelector("canvas");
    this.signaturePad.set("minWidth", 1);
    this.signaturePad.set("canvasWidth", canvas.offsetWidth);
    this.signaturePad.set("canvasHeight", canvas.offsetHeight);
  }

  ionViewWillEnter() {
    this.api.getMaxCheckInLock().subscribe(
      res => {
        this.maxAllowed = res;
      },
      error => {
        alert(error);
      }
    );
  }

  ionViewDidEnter() {
    this.loading = this.loadingCtrl.create({
      spinner: "circles",
      showBackdrop: false
    });

    this.loading.present().then(() => {
      for (let element of this.previousCheckin) {
        var mon = this.dateWorker.getMonthFromDate(element.date);
        var year = this.dateWorker.getYearFromDate(element.date);

        if (
          mon == this.dateWorker.CurrenMonth() &&
          year == this.dateWorker.CurrentYear()
        ) {
          let ob = { mon, year, memberId: element.memberId };
          this.prevCheckin.push(ob);
        }
      }
      this.countCheckins();
    });
  }

  countCheckins() {
    var isMax = this.prevCheckin.length < this.maxAllowed ? true : false;
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
      position: "top",
      showCloseButton: true,
      dismissOnPageChange: true,
      closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });

    toast.present();
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    this.canvasResize();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  drawClear() {
    this.signaturePad.clear();
  }

  save() {
    this.signatureImage = this.signaturePad.toDataURL();
    var today = new Date();
    var date = today.getFullYear() +
      "-" + (today.getMonth() + 1) +
      "-" + today.getDate();
    this.api.postCheckin({
      date: date,
      memberId: this.member.membershipNumber,
      signature: this.signatureImage
    }).subscribe(res =>{
      this.showSuccess();
    });    
  }

  PromptGuestCheckin() {

  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Guests',
      message: 'Do you have any guests?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

  showSuccess() {
    let toast = this.toastCtrl.create({
      message: "You have successfully checked in",
      duration: 4000,
      position: "top",
      showCloseButton: true,
      dismissOnPageChange: true,
      closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      this.presentConfirm();
    });

    toast.present();
  }

  showError(Error: string) {
    let confirm = this.alertCtrl.create({
      title: "Error",
      message: Error,
      buttons: [
        {
          text: "OK",
          handler: () => {
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present();
  }
}
