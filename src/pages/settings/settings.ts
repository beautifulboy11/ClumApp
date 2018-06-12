import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Settings } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  selectedTheme: string;
  options: any;
  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: "profile",
    pageTitleKey: "SETTINGS_PAGE_PROFILE"
  };

  page: string = "main";
  pageTitleKey: string = "SETTINGS_TITLE";
  pageTitle: string;
  subSettings: any = SettingsPage;

  on: string;
  constructor(
    public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
  ) {
    this.settings.getActiveTheme().subscribe(val => {
      this.selectedTheme = val;
    });
  }

  toggleAppTheme() {
    if (this.selectedTheme === "dark-theme") {
      this.settings.setActiveTheme("light-theme");
      this.on = "dark";
    } else {
      this.settings.setActiveTheme("dark-theme");
      this.on = "glow";
    }
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case "main":
        break;
      case "profile":
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get("page") || this.page;
    // this.pageTitleKey = this.navParams.get("pageTitleKey") || this.pageTitleKey;

    // this.translate.get(this.pageTitleKey).subscribe(res => {
    //   this.pageTitle = res;
    // });

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    
  }
}
