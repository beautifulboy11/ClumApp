import { Component, ViewChild, OnInit } from "@angular/core";
import {
  NavController,
  ViewController,
  AlertController,
  NavParams,
  ModalController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { AngularFireDatabase, AngularFireList } from "angularfire2/database";
import { Api } from "../../providers/api/api";
import { DateWorkerService } from "../../providers/date-worker/date-worker";
import { Member } from "../../models/member";
import { GuestCheckinPage } from "../guest-checkin/guest-checkin";
import { AuthService } from "../../providers/providers";

@Component({
  selector: "page-signature",
  templateUrl: "signature.html"
})
export class SignaturePage implements OnInit {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;

  public signaturePadOptions: Object = {
    minWidth: 2,
    canvasWidth: 340,
    canvasHeight: 200
  };

  signatureImage: string;
  member: any;
  prevCheckin: any = [];
  checkinRef: AngularFireList<any>;
  MaxcheckinRef: AngularFireList<any>;
  previousCheckin: any = [];
  maxAllowed: number;
  loading: any;
  securitySite: any;
  isReadyToSave: boolean;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private api: Api,
    private authService: AuthService,
    private dateWorker: DateWorkerService,
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

  ngOnInit() {
    this.authService.uSite().subscribe(res => {
      this.securitySite = res;
      console.log(res);
    });
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    this.canvasResize();
  }

  canvasResize() {
    let canvas = document.querySelector("canvas");
    this.signaturePad.set("minWidth", 1);
    this.signaturePad.set("canvasWidth", canvas.offsetWidth);
    this.signaturePad.set("canvasHeight", canvas.offsetHeight);
  }
 
  countCheckins() {
    var isMax = this.prevCheckin.length < this.maxAllowed ? true : false;
    if (isMax) {
      this.loading.dismiss();
      this.isReadyToSave = true;
    } else {
      this.loading.dismiss();
      this.presentToast();
    }
  }

  presentToast() {
    // `You have used up ${this.maxAllowed} checkin this month`
    let toast = this.toastCtrl.create({
      message: `You have used up the free checkin this month`,
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
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  drawClear() {
    this.signaturePad.clear();
  }

  save() {
    this.loading = this.loadingCtrl.create({
      spinner: "circles",
      showBackdrop: false
    });

    this.loading.present().then(() => {
      this.signatureImage = this.signaturePad.toDataURL();
      var today = new Date();
      var date = today.getFullYear() +
        "-" + (today.getMonth() + 1) +
        "-" + today.getDate();
      this.api.postCheckin({
        date: date,
        memberId: this.member.membershipNumber,
        signature: this.signatureImage
      }).subscribe(res => {
        this.isReadyToSave = false;
        this.drawClear();
        this.loading.dismiss();        
        this.showSuccess();
      });
    });
  }

  GuestCheckin(mem: Member) {
    let addGuestModal = this.modalCtrl.create(GuestCheckinPage);
    addGuestModal.onDidDismiss(guests => {
      if (guests) {
        this.api.postGuestCheckin(mem.membershipNumber, guests);
      }
    })
    addGuestModal.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Guest Checkin',
      message: 'Would you like to checkin any guests?',
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
            this.GuestCheckin(this.member);
          }
        }
      ]
    });
    alert.present();
  }

  showSuccess() {
    let toast = this.toastCtrl.create({
      message: "Checked in successfully",
      duration: 5000,
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
