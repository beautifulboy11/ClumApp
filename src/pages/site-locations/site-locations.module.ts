import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SiteLocationsPage } from './site-locations';
import { AgmCoreModule } from '@agm/core';

@NgModule({
    declarations: [
        SiteLocationsPage
    ],
    imports: [
        AgmCoreModule,
        IonicPageModule.forChild(SiteLocationsPage),
    ],
    exports: [
        SiteLocationsPage
    ]
})
export class SiteLocationsPageModule { }