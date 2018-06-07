import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  AlertController,
  LoadingController,
  MenuController
} from "ionic-angular";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "../../providers/authentication-service/authentication-service";
import { MainPage, ResetPasswordPage } from "../pages";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { ApplicationUser } from "../../models/applicationUser";
import { MessageService } from "../../providers/providers";
@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  private submitAttempt: boolean = false;
  private loginErrorString: string;
  private loading: any;
  private showImage: string;
  model: ApplicationUser = { email: "", password: "" };
  passicon: string = "eye";
  type: string = "password";
  margin_top: number;
  noScroll: string = "no-scroll";
  validEmail: boolean = false;
  validPassword: boolean = false;
  isFormValid: boolean;
  email_dirty: string = "form-control empty ok input-lg";
  password_dirty: string = "form-control empty ok input-lg";
  constructor(
    public navCtrl: NavController,
    public authservice: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public fb: FormBuilder,
    public loadingCtrl: LoadingController,
    private screenOrientation: ScreenOrientation,
    private menu: MenuController,
    private message: MessageService
  ) { }

  ngOnInit() {
    this.createForm();
    this.screenOrientation.onChange().subscribe(() => {
      if (
        this.screenOrientation.type ==
        this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
      ) {
        this.showImage = "block";
        this.margin_top = 0;
        this.noScroll = "no-scroll";
      } else {
        this.showImage = "none";
        this.margin_top = -19;
        this.noScroll = "no-scroll";
      }
    });
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        ])
      ],
      password: ["", Validators.required]
    });
  }

  togglePasswordVisible(event) {
    event.preventDefault();
    if (this.passicon == "eye") {
      this.passicon = "eye-off";
      this.type = "text";
    } else {
      this.passicon = "eye";
      this.type = "password";
    }
  }

  public emailChanged() {
    let field = "email";
    this[field + "changed"] = true;
    this.isFormValid = this.loginForm.valid;
    this.validEmail = this.loginForm.controls.email.valid;
    if (this.loginForm.controls.email.value === "") {
      this.email_dirty = "form-control empty ok input-lg";
    } else {
      if (this.validEmail) {
        this.email_dirty = "form-control not-empty ok input-lg";

      } else {
        this.email_dirty = "form-control not-empty not-ok input-lg";
      }
    }
  }

  public passwordChanged() {
    let field = "password";
    this[field + "changed"] = true;
    this.isFormValid = this.loginForm.valid;
    this.validPassword = this.loginForm.controls.password.valid;
    if (this.loginForm.controls.password.value === "") {
      this.password_dirty = "form-control empty not-ok input-lg";
    } else {
      this.password_dirty = "form-control not-empty ok input-lg";
    }
  }

  public Signup() {
    alert('Sorry, You are not allowed to sign up at this time');
    //this.navCtrl.push("SignupPage");
  }
  public removeAuth(code: string): string {
    return code
      .substring(5)
      .replace("-", " ")
      .toUpperCase();
  }

  public Login(): any {
    this.submitAttempt = true;
    if (this.isFormValid) {
      this.authservice
        .doLogin({ email: this.loginForm.controls.email.value, password: this.loginForm.controls.password.value })
        .subscribe(auth => {
          if (auth) {
            this.navCtrl.setRoot("TabsPage");
          }
        },
          error => {
            this.loading.dismiss().then(() => {
              this.showError(error);
            });
          });
      this.showLoading();
    } else {
      return;
    }
  }

  showError(error) {
    let alert = this.alertCtrl.create({
      title: this.removeAuth(error.code),
      message: error.message,
      buttons: [
        {
          text: "Ok",
          role: "cancel"
        }
      ]
    }).present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  public resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }
}
