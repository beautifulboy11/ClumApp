import { Component } from "@angular/core";
import {
  NavController,
  AlertController, 
  LoadingController,
  ToastController
} from "ionic-angular";

import { Api } from "../../providers/providers";

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
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private api: Api
  ) {
    this.club = 'Nkana';
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
          this.members = [];
          this.mufMembers = [];
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

  ionViewWillEnter() {
    this.api.getMaxCheckInLock().subscribe(
      res => {
        this.maxAllowed = res;
        console.log(res);
      },
      error => {
        alert(error);
      }
    );
  }

  getItems(ev) {
    let val = ev.target.value;
    if (!val || !val.trim()) {
      return;
    }

    // this.members = this.query({
    //   firstName: val,
    //   lastName: val,
    //   membershipNumber: val
    // });
  }
}
