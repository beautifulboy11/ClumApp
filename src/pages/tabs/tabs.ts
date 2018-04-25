import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage, MemberPage, SearchPage, SettingsPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})

export class TabsPage {
  
  homeTab: any = HomePage;
  searchTab: any = SearchPage;
  settingsTab: any = SettingsPage;
  membersTab: any = MemberPage;

  constructor(public navCtrl: NavController) {    
  }
}
