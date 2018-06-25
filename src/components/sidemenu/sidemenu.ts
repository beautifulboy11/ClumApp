import { Component, ViewChild, Input } from '@angular/core';
import { Nav } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'sidemenu',
  templateUrl: 'sidemenu.html'
})
export class SidemenuComponent {  
  @Input() nav: any;
  pages: Array<{ title: string; icon: string; component: string }>;

  constructor(private af: AngularFireAuth) {
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
        component: "NotificationsPage"
      },
      {
        title: "Settings",
        icon: "settings",
        component: "SettingsPage"
      }
    ];
  }

  openPage(page) {
    this.nav.push(page.component);
  }
  SwipePage(): void {
    this.nav.push("E2EPage");
  }
  signOut(): Promise<void> {
    return this.af.auth.signOut().then(res => {
      this.nav.setRoot("LoginPage");
    });
  }

  profile(): void{
    this.nav.push("MyProfilePage");
  }

}
