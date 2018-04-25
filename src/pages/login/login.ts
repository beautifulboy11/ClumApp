import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/authentication-service/authentication-service';
import { MainPage, ResetPasswordPage } from '../pages';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public loginForm;
  private submitAttempt: boolean = false;
  private loginErrorString: string;
  private loading: any;
  private showImage: string;
  passicon: string = 'eye';
  type: string = 'password';
  margin_top: number;

  constructor(public navCtrl: NavController,
    public authservice: AuthService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    private screenOrientation: ScreenOrientation,
    private menu: MenuController
  ) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)])],
      password: ['', Validators.required]
    });

    this.translateService.get('LOGIN_ERROR')
      .subscribe((value) => {
        this.loginErrorString = value;
      });

    this.screenOrientation.onChange().subscribe(() => {
      if (this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY) {
        this.showImage = 'block';
        this.margin_top = 0;
      } else {
        this.showImage = 'none';
        this.margin_top = -20;
      }
    });
  }
 
  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

  public togglePasswordVisible(event) {
    event.preventDefault();
    if (this.passicon == 'eye') {
      this.passicon = 'eye-off';
      this.type = 'text';
    } else {
      this.passicon = 'eye';
      this.type = 'password';
    }

  }

  public elementChanged(input) {
    let field = input.ngControl.name;
    this[field + "Changed"] = true;
  }

  public Signup() {
    this.navCtrl.push('SignupPage');
  }

  public Login(event): any {
    event.preventDefault();
    this.submitAttempt = true;
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
    else {
      var credentials = ({ email: this.loginForm.value.email, password: this.loginForm.value.password });
      this.authservice.doLogin(credentials)
        .subscribe(
          (auth) => { this.navCtrl.setRoot('TabsPage'); },
          (error) => {
            this.loading.dismiss().then(() => {
              let alert = this.alertCtrl.create({
                title: error.code,
                message: error.message,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          }
        );
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  public resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

}
