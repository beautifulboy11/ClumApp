import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/providers';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  userProfile: any;
  constructor(private af: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
  }

  ionViewDidLoad() {
    this.auth.user.subscribe(user => {
      if (user) {
        console.log(user)
        this.userProfile = user;       
      } else {        
      }
    });
  }

  signOut(): Promise<void> {
    return this.af.auth.signOut()
    .then(() => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

  mailPreferences(): void{

  }
  gotoHistory(): void{
    alert('Will goto MyHistory Page');
  }

}
