import { Component, OnInit } from "@angular/core";
import {
  NavController,
  ToastController,
  LoadingController
} from "ionic-angular";
import { AuthService } from "../../providers/providers";
import { take } from 'rxjs/operators';

//@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  loading: any;
  userType: any;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private auth: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    return this.auth.user
      .pipe(
        take(1)
        ).subscribe(data => {
        this.initPage(data);
      });
  }


  initPage(data) {   
    if (data && data.email && data.uid) {
      this.toastCtrl
        .create({
          message: `Welcome, ${data.email}`,
          duration: 4000
        })
        .present();
    } else {
      this.toastCtrl
        .create({
          message: `You have logged out`,
          duration: 3000
        })
        .present();
    }

    this.loading = this.loadingCtrl.create({
      showBackdrop: true
    });

    this.loading.present().then(() => {
      this.determineAccess();
    });
  }

  gotoContent() {
    if (this.auth.isAdmin()) {
      this.goto("MemberPage");
    } else if (this.auth.isSecurity()) {
      this.gotoCheckin();
    } else {
      this.goto("CheckinSummaryPage");
    }
  }

  determineAccess() {
    this.auth.user.subscribe(res => {
      if (res) {
        this.loading.dismiss();
      }
    });
  }

  gotoCheckin(): void {
    this.navCtrl.push("CheckinPage");
  }

  goto(page: string): void {
    this.navCtrl.push(page);
  }

  gotoMap(event) {
    this.navCtrl.push("SiteLocationsPage");
  }

  search() {
    this.navCtrl.push("CheckinPage");
  }
}
