import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage, MemberPage, SearchPage, SettingsPage } from '../pages';

@IonicPage()
@Component({
  selector: 'page-tabs',
  template: `<ion-tabs color="dark">
  <ion-tab [root]="homeTab" tabTitle='Home' tabIcon="home"></ion-tab>
  <!-- <ion-tab [root]="membersTab" tabTitle='Members' tabIcon="ios-contact"></ion-tab> -->
  <ion-tab [root]="searchTab" tabTitle='Search' tabIcon="search"></ion-tab>
  <ion-tab [root]="settingsTab" tabTitle='Settings' tabIcon="cog"></ion-tab> 
  <ion-tab [root]="settingsTab" tabTitle='My Profile' tabIcon="person"></ion-tab>   
</ion-tabs>`
})

export class TabsPage {
  
  homeTab: any = HomePage;
  searchTab: any = SearchPage;
  settingsTab: any = SettingsPage;
  membersTab: any = MemberPage;

  constructor(public navCtrl: NavController) {    
  }
}
