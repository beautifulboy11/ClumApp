import { NgModule } from '@angular/core';
import { PopoverPage } from './popover';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
    declarations: [
        PopoverPage
    ],
    imports: [
        IonicPageModule.forChild(PopoverPage)
    ],
    exports: [
        PopoverPage
    ]
})
export class PopoverPageModule { }