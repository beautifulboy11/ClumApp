import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicModule, IonicApp, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2/';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AgmCoreModule } from '@agm/core';

import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Calendar } from '@ionic-native/calendar';
import { Network } from '@ionic-native/network';
import { SQLite } from '@ionic-native/sqlite'
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { Geolocation } from '@ionic-native/geolocation';
import { environment } from '../environments/environment';
import { Sqlstorage } from '../providers/sqlstorage/sqlstorage';
/*Services*/
import { DateWorkerService } from '../providers/date-worker/date-worker';
import { NetworkService } from '../providers/network-service/network-service';
import { MessageService } from '../providers/message-service/message-service';
import { DataService, Settings, AuthService } from '../providers/providers';
/*Pages and Pages Module*/
import { DirectivesModule } from '../directives/directive.module';
import { MemberDetailPageModule } from '../pages/member-detail/member-detail.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { AddEventPageModule } from '../pages/add-event/add-event.module';
import { SiteLocationsPageModule } from '../pages/site-locations/site-locations.module';
import { HomePage } from '../pages/pages';
import { PipesModule } from '../pipes/pipes.module';
import { MyProfilePageModule } from '../pages/my-profile/my-profile.module';
import { ComponentsModule } from '../components/components.module';
import { SignaturePageModule } from '../pages/signature/signature.module';
import { GuestCheckinPageModule } from '../pages/guest-checkin/guest-checkin.module';
import { CheckinPageModule } from '../pages/checkin/checkin.module';
import { CheckinSummaryPageModule } from '../pages/checkin-summary/checkin-summary.module';

export const firebaseConfig = environment.firebaseConfig;
// juhy6t5

export function provideSettings(storage: Storage) {
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],

  imports: [
    BrowserModule,
    SignaturePadModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      tabsHideOnSubPages: true,
      spinner: 'ios',
      alertEnter: 'alert-pop-in',
      alertLeave: 'alert-pop-out',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    PipesModule,
    DirectivesModule,
    ComponentsModule,
    MemberDetailPageModule,
    ResetPasswordPageModule,
    MyProfilePageModule,
    AddEventPageModule,
    SignaturePageModule,
    GuestCheckinPageModule,
    CheckinSummaryPageModule,
    CheckinPageModule,
    SiteLocationsPageModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    DataService,
    Camera,
    SplashScreen,
    StatusBar,
    Network,
    ScreenOrientation,
    Geolocation,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Calendar,
    AuthService,
    SQLite,
    Sqlstorage,
    DateWorkerService,
    NetworkService,
    MessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
