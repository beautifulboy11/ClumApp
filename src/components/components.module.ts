import { NgModule } from '@angular/core';
import { MessageComponent } from './message/message';
import { IonicModule } from 'ionic-angular';
import { SidemenuComponent } from './sidemenu/sidemenu';

@NgModule({
	declarations: [MessageComponent,
    SidemenuComponent],
	imports: [IonicModule],
	exports: [MessageComponent,
    SidemenuComponent]
})
export class ComponentsModule {}
