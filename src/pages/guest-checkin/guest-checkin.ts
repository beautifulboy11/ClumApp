import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  AlertController,
  App,
  ToastController
} from "ionic-angular";
import { Guest } from "../../models/Guest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CheckinPage } from "../pages";
import { DataService } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-guest-checkin",
  templateUrl: "guest-checkin.html"
})
export class GuestCheckinPage implements OnInit {
  guests: Array<Guest> = [];
  guestForm: FormGroup;
  isReadyToSave: boolean;
  member: any;
  guestCount: any;
  allowed: number = 2;

  constructor(
    public appCtrl: App,
    private api: DataService,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {
    this.member = navParams.get("member");
  }

  ngOnInit() {
    this.createForm();
    this.guestForm.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.guestForm.valid;
    });
  }

  getGuestLogs() {
    this.api
      .getPreviousGuestCheckins(this.member.membershipNumber, `${new Date().getFullYear()}-${(new Date().getMonth() + 1)}`)
      .subscribe(res => {
        if (res) {
          this.guestCount = res;
        }
      });
  }

  ionViewDidLoad() {
    this.getGuestLogs();
    this.presentConfirm();
  }

  createForm() {
    this.guestForm = this.formBuilder.group({
      id: ["", Validators.compose([Validators.minLength(8), Validators.required, Validators.pattern(/[0-9]/g)])],
      firstname: [
        "",
        Validators.compose([Validators.minLength(2), Validators.required])
      ],
      lastname: [
        "",
        Validators.compose([Validators.minLength(2), Validators.required])
      ]
    });
  }

  checkGuestLog() {
    var proceed = this.guestCount.length < this.allowed ? true : false;
    if (!proceed) {
      this.presentMessage();
    }
  }

  presentMessage() {
    let toast = this.toastCtrl.create({
      message: `You have used up your free guest slots this month`,
      duration: 4000,
      position: "bottom",
      showCloseButton: true,
      closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      this.appCtrl.getRootNav().popTo(CheckinPage);
    });

    toast.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Guest Checkin",
      message: "Would you like to checkin any guests?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            this.viewCtrl.dismiss();
          }
        },
        {
          text: "Yes",
          handler: () => {
            //this.GuestCheckin(this.member);
            this.checkGuestLog();
          }
        }
      ]
    });
    alert.present();
  }
  createItem() {
    this.AddGuest();
  }

  AddGuest() {
    this.guests.push(this.guestForm.value);
    this.guestForm.reset();
  }

  cancel() {
    this.navCtrl.popTo(CheckinPage);
  }

  done() {
    if (this.guests.length === 0) {
      return;
    }
    this.api.postGuestCheckin(this.member.membershipNumber, this.guests)
      .subscribe(res => {
        this.showSuccess();
      });
  }

  showSuccess() {
    let toast = this.toastCtrl.create({
      message: "Guests Checked-in successfully",
      duration: 3000,
      position: "bottom",
      showCloseButton: true,
      dismissOnPageChange: true,
      //closeButtonText: "OK"
    });

    toast.onDidDismiss(() => {
      this.viewCtrl.dismiss();
      this.appCtrl.getRootNav().popTo(CheckinPage);
    });

    toast.present();
  }
}
