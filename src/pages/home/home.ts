import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController} from "ionic-angular";
import { SiteLocationsPage } from "../pages";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService } from '../../providers/providers';
@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private authService: AuthService,
  ) {}

  ionViewDidLoad() {
    try {
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

  goto(page: string): void {
    this.navCtrl.push(page);
  }
  gotoMap(event) {
    console.log(event);
    this.navCtrl.push(SiteLocationsPage);
  }
  search() {
    this.navCtrl.push("SearchPage");
  }
}
