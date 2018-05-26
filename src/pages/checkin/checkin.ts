import { Component } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController,
  ToastController,
  PopoverController
} from "ionic-angular";

import { Api } from "../../providers/providers";
import { MemberDetailPage, PopoverPage } from "../pages";

@Component({
  selector: "page-checkin",
  templateUrl: "checkin.html"
})
export class CheckinPage {
  club: string;
  private membersList: any;
  public maxAllowed: number;
  public loading: any;
  mufMembers: any = [];
  members: any = [];
  currentMembers: any = [];
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private api: Api
  ) {
    this.club = "Nkana";
  }

  ionViewDidLoad() {
    this.loadMembers();
  }

  loadMembers(): any {
    this.loading = this.loadingCtrl.create({
      content: "Loading...",
      spinner: "bubbles",
      showBackdrop: false
    });

    this.loading.present().then(() => {
      this.api.getMembers().subscribe(
        res => {
          res.forEach(resp => {
            if (resp.club === "Nkana") {
              this.members.push(resp);
            } else {
              this.mufMembers.push(resp);
            }
          });
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss().then(() => {
            this.toastCtrl
              .create({
                position: "bottom",
                message: error.message,
                showCloseButton: true,
                cssClass: "toast-message",
                closeButtonText: "Dismiss",
                dismissOnPageChange: true
              })
              .present();
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

  getItems(ev) {
    this.members = [];
    this.mufMembers = [];
    let val = ev.target.value;
    if (!val || !val.trim()) {
      this.currentMembers = [];
      return;
    }
    this.currentMembers = this.api.query({
      firstName: val,lastName: val,membershipNumber: val
    });
    this.currentMembers.forEach(resp => {
      if (resp.club === "Nkana") {
        this.members.push(resp);
      } else {
        this.mufMembers.push(resp);
      }
    });
  }

  viewDetails(member: any) {
    this.navCtrl.push(MemberDetailPage, {
      member: member
    });
  }
}
