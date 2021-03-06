import { Component, ViewChild, OnInit } from "@angular/core";
import {
  NavController,
  ViewController,
  AlertController,
  NavParams,
  ModalController,
  LoadingController,
  ToastController,
  IonicPage
} from "ionic-angular";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { DataService } from "../../providers/providers";
import { DateWorkerService } from "../../providers/date-worker/date-worker";
import { Member } from "../../models/member";
import { AuthService } from "../../providers/providers";

@IonicPage()
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
  previousCheckin: any = [];
  maxAllowed: number;
  loading: any;
  securitySite: any;
  isReadyToSave: boolean;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private api: DataService,
    private authService: AuthService,
    private dateWorker: DateWorkerService,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.member = navParams.get("member");
  }

  ionViewWillEnter() {
    this.getLatest();
    this.getMax();
  }

  ionViewDidEnter() {
    this.verifyEligibility();
  }

  verifyEligibility() {
    this.loading = this.loadingCtrl.create({
      spinner: "dots",
      content: 'Checking',
      showBackdrop: false
    });

    this.loading.present().then(() => {
      this.checkinLoad();
      this.countCheckins();
    });
  }

  ngOnInit() {
    this.authService.uSite().subscribe(res => {
      this.securitySite = res;
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

  getMax() {
    this.api.getMaxCheckInLock()
      .subscribe(res => {
        if (res) {         
          res.forEach(element => {
            this.maxAllowed = element.maxCheckinsAllowed;
          });         
        }
      });
  }
  
  checkinLoad() {
    if (this.previousCheckin.length > 0) {
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
    } {
      return;
    }
  }

  async getLatest() {
   await this.api.getLatestCheckin(this.member.membershipNumber)
      .subscribe(res => {       
        if (res) {
          this.previousCheckin = res;
        }
      });
  }

  isLocalClub(): boolean {
    return this.member.club == this.securitySite;
  }

  countCheckins() {  
    if (this.isLocalClub()) {
      this.loading.dismiss();
      this.isReadyToSave = true;
    }
    else {
      if (this.prevCheckin.length < this.maxAllowed) {
        this.loading.dismiss();
        this.isReadyToSave = true;
      } else {
        this.loading.dismiss();
        this.presentToast();
      }
    }
  }
  
  presentToast() {
    let toast = this.toastCtrl.create({
      message: `You have used up the free checkin this month`,
      duration: 4000,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });

    toast.present();
  }

  cancel() {
    this.navCtrl.popTo('CheckinPage');
  }

  drawClear() {
    this.signaturePad.clear();
  }

  save() {
    this.loading = this.loadingCtrl.create({
      spinner: "dots",
      content: "Saving",
      showBackdrop: true
    });

    this.loading.present().then(() => {

      this.signatureImage = this.signaturePad.toDataURL();

      var date = this.fullDate();
      this.api.postCheckin({
          date: date,
          memberId: this.member.membershipNumber,
          signature: this.signatureImage,
          site: this.securitySite
        })
        .subscribe(res => {
          this.isReadyToSave = false;
          this.drawClear();
          this.loading.dismiss();
          this.showSuccess();
        });
    });
  }

  fullDate(): string {
    var today = new Date();
    return `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
  }

  GuestCheckin(mem: Member) {
    let addGuestModal = this.modalCtrl.create('GuestCheckinPage', {
      member: mem
    });
    addGuestModal.onDidDismiss(guests => {
      if (guests) {
        //this.api.postGuestCheckin(mem.membershipNumber, guests);
      } else {
        //this.viewCtrl.
      }
    });
    addGuestModal.present();
  }

  showSuccess() {
    let toast = this.toastCtrl.create({
      message: "Check-in Saved successfully",
      duration: 3000,
      position: "bottom",
      showCloseButton: true,
      dismissOnPageChange: true,
      closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      if (this.isLocalClub()) {
        this.GuestCheckin(this.member);
      }
      else {
        this.navCtrl.popTo('CheckinPage');
      }
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
