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

  ionViewDidLoad() {
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

  // elementChanged(input) {

  //   let field = input.ngControl.name;
  //   this[field + "Changed"] = true;
  // }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Guest Checkin",
      message: "Would you like to checkin any guests?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          handler: () => {
            this.navCtrl.popTo(CheckinPage);
          }
        },
        {
          text: "Yes",
          handler: () => {
            //this.GuestCheckin(this.member);
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
