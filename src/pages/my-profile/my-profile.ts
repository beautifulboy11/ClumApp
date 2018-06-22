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
    this.auth.isAuthenticated().subscribe(user => {
      if (user) {
        this.userProfile = user;       
      } else {        
      }
    });
  }

  signOut(): Promise<void> {
    return this.af.auth.signOut()
    .then(res => {
      this.navCtrl.setRoot("LoginPage");
    });
  }

}
