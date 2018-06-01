import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule,TranslateLoader } from '@ngx-translate/core';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicModule, IonicApp, IonicErrorHandler} from 'ionic-angular';
import { AngularFireModule } from 'angularfire2/';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from "angularfire2/auth";
import { SignaturePadModule } from 'angular2-signaturepad';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
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
import { Api, Settings, AuthService } from '../providers/providers';
/*Pages and Pages Module*/
import { MessageComponent } from '../components/message/message';
import { DirectivesModule } from '../directives/directive.module';
import { GuestCheckinPage } from '../pages/guest-checkin/guest-checkin';
import { MemberDetailPageModule } from '../pages/member-detail/member-detail.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { AddEventPageModule } from '../pages/add-event/add-event.module';
import { E2EPage } from '../pages/e2e/e2e';
import { HomePage, SignaturePage, PopoverPage, SiteLocationsPage, CheckinPage} from '../pages/pages';


export const firebaseConfig = environment.firebaseConfig;
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    SignaturePage,
    E2EPage,
    HomePage,   
    CheckinPage, 
    PopoverPage,        
    SiteLocationsPage,
    GuestCheckinPage,
    MessageComponent
  ],

  imports: [
    BrowserModule,
    SignaturePadModule,    
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,            
    MemberDetailPageModule,
    ResetPasswordPageModule,    
    AddEventPageModule,
    // ComponentsModule,
    DirectivesModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
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
    })
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    E2EPage,  
    CheckinPage,          
    SignaturePage,
    PopoverPage,    
    SiteLocationsPage ,
    GuestCheckinPage  
  ],
  providers: [
    Api,
    Camera,
    SplashScreen,
    StatusBar,
    Network,
    ScreenOrientation,
    Geolocation,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    Calendar,
    AuthService,
    SQLite,
    Sqlstorage,
    DateWorkerService,
    NetworkService,
    MessageService
  ]
})
export class AppModule { }
