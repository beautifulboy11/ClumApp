import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {
  IonicPage,
  NavController,
  ToastController,
  AlertController,
  LoadingController,
  MenuController
} from "ionic-angular";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../providers/providers";
import { MainPage } from "../pages";

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  private signupErrorString: string;
  private loading: any;
  public registerForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  fullnameChanged: boolean = false;
  submitAttempt: boolean = false;

  constructor(
    public navCtrl: NavController,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private menu: MenuController
  ) {
    this.translateService.get("SIGNUP_ERROR").subscribe(value => {
      this.signupErrorString = value;
    });

    this.registerForm = formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        ])
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(8), Validators.required])
      ],
      fullname: [
        "",
        Validators.compose([Validators.minLength(2), Validators.required])
      ]
    });
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  elementChanged(input) {
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  doSignup() {
    this.submitAttempt = true;
    if (!this.registerForm.valid) {
      console.log(this.registerForm.value);
    } else {
      this.authService
        .registerUser(
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .subscribe(
          response => {
            this.loading.dismiss().then(() => {
              this.alertCtrl.create({
                message: "Registered Successfully",
                buttons: [
                  {
                    text: "Ok",
                    role: "cancel",
                    handler: () => {
                      this.navCtrl.setRoot("LoginPage");
                    }
                  }
                ]
              }).present();
            });
          },
          error => {
            this.loading.dismiss().then(() => {
              this.alertCtrl.create({
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: "cancel"
                  }
                ]
              }).present();
            });
          }
        );

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true
      });
      this.loading.present();
    }
  }
}
