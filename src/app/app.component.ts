import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Config, Nav, Platform, LoadingController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
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
  pages: Array<{ title: string; icon: string; component: string }>;

  userProfile: any;

  showSplash: boolean = true;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private config: Config,
    private translate: TranslateService,
    public settings: Settings,
    public authService: AuthService,
    public af: AngularFireAuth,
    public loadingCtrl: LoadingController,
    public storage: Storage
  ) {
    this.initializeApp();
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;      
    });
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
      timer(3000).subscribe(() => (this.showSplash = false));
      this.storage.get("introShown").then(result => {
        if (result) {
          this.AuthenticationState();
        } else {
          this.rootPage = "SlidePage";
          this.storage.set("introShown", true);
        }
      });
    });
    this.initTranslate();
  }

  AuthenticationState() {
    this.af.authState.subscribe(user => {
      if (user) {
        this.userProfile = user;
        this.rootPage = "TabsPage";
      } else {
        this.rootPage = "LoginPage";
      }
    });
  }

  initTranslate() {
    this.translate.setDefaultLang("en");
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === "zh") {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use("zh-cmn-Hans");
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use("zh-cmn-Hant");
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use("en");
    }

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);
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
  SwipePage(): void{
    this.nav.push(E2EPage);
  }
}
