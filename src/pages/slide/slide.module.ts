import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SlidePage } from './slide';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SlidePage,
  ],
  imports: [
    IonicPageModule.forChild(SlidePage),
    TranslateModule.forChild()
  ],
  exports: [
    SlidePage
  ]
})
export class SlidePageModule { }
