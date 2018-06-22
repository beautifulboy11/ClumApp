import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { E2EPage } from './e2e';

@NgModule({
  declarations: [
    E2EPage,
  ],
  imports: [
    IonicPageModule.forChild(E2EPage),
  ],
  exports:[
    E2EPage
  ]
})
export class E2EPageModule {}
