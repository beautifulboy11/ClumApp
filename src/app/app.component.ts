import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Config, Nav, Platform } from "ionic-angular";
import { Settings, AuthService } from "../providers/providers";
import { AngularFireAuth } from "angularfire2/auth";
import { timer } from "rxjs/observable/timer";
import { E2EPage } from "../pages/e2e/e2e";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  selectedTheme: String;
  showSplash: boolean = true;
  userProfile: any;
  pages: Array<{ title: string; icon: string; component: string }>;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private config: Config,
    public settings: Settings,
    private authService: AuthService,
    private af: AngularFireAuth,
  ) {
    this.initializeApp();
    this.pages = [
      {
        title: "News Feeds",
        icon: "paper",
        component: "CardsPage"
      },
      {
        title: "Upcoming Events",
        icon: "checkbox",
        component: "ContentPage"
      },
      {
        title: "My notifications",
        icon: "notifications",
        component: "MemberPage"
      },
      {
        title: "Settings",
        icon: "settings",
        component: "SettingsPage"
      }
    ];
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
            this.initState();
          } else {
            this.rootPage = "SlidePage";
            this.settings.setSetting();
          }
        });

    });
  }

  initState() {
    this.af.authState.subscribe(user => {
      if (user) {
        this.userProfile = user;
        this.rootPage = "TabsPage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
  }

  openPage(page) {
    this.nav.push(page.component);
  }

  signOut(): Promise<void> {
    return this.af.auth.signOut().then(res => {
      this.nav.setRoot("LoginPage");
    });
  }
  SwipePage(): void {
    this.nav.push(E2EPage);
  }
}
