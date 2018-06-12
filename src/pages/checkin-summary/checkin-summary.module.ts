import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckinSummaryPage } from './checkin-summary';

@NgModule({
  declarations: [
    CheckinSummaryPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckinSummaryPage),
  ],
  exports:[
    CheckinSummaryPage
  ]
})
export class CheckinSummaryPageModule {}
