import { Component, OnInit } from "@angular/core";
import {
  NavController,
  ToastController,
  PopoverController,
  IonicPage
} from "ionic-angular";
import { DataService } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-checkin",
  templateUrl: "checkin.html"
})

export class CheckinPage implements OnInit {
  public isSearchbarOpened = false;
  public club: string;
  public loading: any;
  public mufMembers: any = [];
  public members: any = [];
  currentMembers: any = [];
  public isLoading = false;

  constructor(
    private navCtrl: NavController,
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private api: DataService
  ) {
    this.club = "Nkana";
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    this.api.getCollection("members", true, true).subscribe(
      res => {
        res.forEach(resp => {
          if (resp.club === "Nkana") {
            this.members.push(resp);
          } else {
            this.mufMembers.push(resp);
          }
        });
        this.isLoading = false;
      },
      error => {
        this.showAlert(error);
      }
    );
  }

  showAlert(error) {
    this.isLoading = false;
    this.toastCtrl
      .create({
        position: "bottom",
        duration: 4000,
        message: error.message,
        showCloseButton: true,
        cssClass: "toast-message",
        closeButtonText: "Dismiss",
        dismissOnPageChange: false
      })
      .present();
  }

  showPopOver($event, member: any) {
    let popover = this.popoverCtrl.create('PopoverPage', { member: member });
    popover.present({
      ev: $event
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
      firstName: val,
      lastName: val,
      membershipNumber: val
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
    this.navCtrl.push('MemberDetailPage', {
      member: member
    });
  }
}
