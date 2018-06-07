import { Component, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { SiteLocationsPage, CheckinPage } from "../pages";
import { AngularFireAuth } from "angularfire2/auth";
import { AuthService, MessageService } from "../../providers/providers";

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
    public navParams: NavParams,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private messageService: MessageService
  ) {
    this.afAuth.authState.subscribe(data => {
      this.initPage(data);
    });  
  }

  ngOnInit() {}

  initPage(data) {
    if (data && data.email && data.uid) {
      this.toastCtrl
        .create({
          message: `Welcome, ${data.email}`,
          duration: 4000
        }).present();
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

  determineAccess() {
    // this.authService.uSite().subscribe(
    //   res => {        
    //     res.map(resp =>{
    //       this.userType = resp;
          
    //     });        
    //   }
    // );
    this.loading.dismiss();
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
