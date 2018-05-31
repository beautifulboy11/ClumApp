import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GuestCheckinPage } from './guest-checkin';

@NgModule({
  declarations: [
    GuestCheckinPage,
  ],
  imports: [
    IonicPageModule.forChild(GuestCheckinPage),
  ],
})
export class GuestCheckinPageModule {}
