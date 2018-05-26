import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { SiteLocationsPage, CheckinPage } from "../pages";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "../../providers/providers";
// @IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  loading: any;
  admin: boolean;
  user: boolean;
  security: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {

  }

  ionViewDidLoad() {
    try {
      this.loading = this.loadingCtrl.create({
        showBackdrop: true
      });

      this.loading.present().then(() => {
        this.determineAccess();
      });

      this.afAuth.authState.subscribe(data => {
        if (data && data.email && data.uid) {
          this.toastCtrl
            .create({
              message: `Welcome, ${data.email}`,
              duration: 3000
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
      });
    } catch (e) {
      console.log(e);
    }
  }

  determineAccess() {
    this.authService.isAdmin();
    this.authService.isSecurity();
    this.authService.isUser();
    this.loading.dismiss();
  }

  gotoCheckin(): void {
    this.navCtrl.push(CheckinPage);
  }

  goto(page: string): void {
    this.navCtrl.push(page);
  }

  gotoMap(event) {
    console.log(event);
    this.navCtrl.push(SiteLocationsPage);
  }

  search() {
    this.navCtrl.push(CheckinPage);
  }
}
