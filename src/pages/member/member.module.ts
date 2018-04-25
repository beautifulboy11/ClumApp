import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MemberPage } from './member';

@NgModule({
  declarations: [
    MemberPage,
  ],
  imports: [
    IonicPageModule.forChild(MemberPage),
    TranslateModule.forChild()
  ],
  exports: [
    MemberPage
  ]
})
export class ListMasterPageModule { }
