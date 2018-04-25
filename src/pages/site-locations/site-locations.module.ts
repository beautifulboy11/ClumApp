import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLocationsPage } from './site-locations';

@NgModule({
  declarations: [
    SiteLocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteLocationsPage),
  ],
})
export class SiteLocationsPageModule {}
