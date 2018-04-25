import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberDetailPage } from './member-detail';

@NgModule({
  declarations: [
    MemberDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberDetailPage),
    TranslateModule.forChild()
  ],
  exports: [
    MemberDetailPage
  ]
})
export class MemberDetailPageModule { }
