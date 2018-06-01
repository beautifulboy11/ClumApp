import { Component, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { SiteLocationsPage, CheckinPage } from "../pages";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from "../../providers/providers";
import { NetworkService } from "../../providers/network-service/network-service";
// @IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  loading: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    public networkService: NetworkService
  ) {
    this.networkService.get().subscribe((res) => {
    });
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(data => {
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
    });
    this.loading = this.loadingCtrl.create({
      showBackdrop: true
    });

    this.loading.present().then(() => {
      this.loading.dismiss();
    });
  }

  determineAccess() {

  }

  gotoCheckin(): void {
    this.navCtrl.push(CheckinPage);
  }

  goto(page: string): void {
    this.navCtrl.push(page);
  }

  gotoMap(event) {
    this.navCtrl.push(SiteLocationsPage);
  }

  search() {
    this.navCtrl.push(CheckinPage);
  }
}
