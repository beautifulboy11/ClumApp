import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { MemberCreatePage } from './member-create';

@NgModule({
  declarations: [
    MemberCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberCreatePage),
    TranslateModule.forChild()
  ],
  exports: [
    MemberCreatePage
  ]
})
export class MemberCreatePageModule { }
