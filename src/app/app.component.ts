import { Component } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Config, Platform } from "ionic-angular";
import { Settings, AuthService } from "../providers/providers";
import { timer } from "rxjs/observable/timer";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any;
  selectedTheme: String;
  showSplash: boolean = true;
  userProfile: any;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private config: Config,
    public settings: Settings,
    private authService: AuthService
  ) {
    this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(2000)
        .subscribe(() => this.showSplash = false);

      this.settings.loadSetting()
        .then(result => {
          if (result) {
            this.initAppState();
          } else {
            this.rootPage = "SlidePage";
            this.settings.setSetting();
          }
        });

    });
  }

  initAppState() {
    this.authService.isAuthenticated().subscribe(user => {
      if (user) {
        this.userProfile = user;
        this.rootPage = "TabsPage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
  }
}
