import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  ViewController,
  NavParams,
  AlertController
} from "ionic-angular";
import { Guest } from "../../models/Guest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CheckinPage } from "../pages";

@IonicPage()
@Component({
  selector: "page-guest-checkin",
  templateUrl: "guest-checkin.html"
})
export class GuestCheckinPage implements OnInit {
  guests: Array<Guest> = [];
  guestForm: FormGroup;
  isReadyToSave: boolean;

  constructor(
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {

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
    this.viewCtrl.dismiss(this.guests);
  }
}
