import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  NavParams,
  AlertController,
  MenuController
} from "ionic-angular";
import { FormBuilder, Validators, FormControl } from "@angular/forms";
import { AuthService } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-reset-password",
  templateUrl: "reset-password.html"
})
export class ResetPasswordPage {
  public resetpwdForm;
  emailChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private menu: MenuController
  ) {
    let EMAIL_REGEXP = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.resetpwdForm = formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(EMAIL_REGEXP)
        ])
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

  resetPassword() {
    if (!this.resetpwdForm.valid) {
    return;
    } else {
      this.authService.resetPassword(this.resetpwdForm.value.email).subscribe(
        auth => {
          this.alertCtrl
            .create({
              message: `Password reset link sent to ${
                this.resetpwdForm.value.email
              }`,
              buttons: [
                {
                  text: "Ok",
                  role: "cancel",
                  handler: ()=>{
                    this.navCtrl.setRoot("LoginPage");
                  }
                }
              ]
            })
            .present();
        },
        error => {
          this.loading.dismiss().then(() => {
            this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: "Ok", role: "cancel" }]
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
