import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
import { AngularFireModule } from 'angularfire2/';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from "angularfire2/auth";
import { SignaturePadModule } from 'angular2-signaturepad';
import { MyApp } from './app.component';
import { ParallaxHeaderDirective } from '../directives/parallax-header/parallax-header';
import { ParallaxProfileDirective } from '../directives/parallax-profile/parallax-profile';
import { Network } from '@ionic-native/network';
import { Api, Settings, AuthService } from '../providers/providers';
import { HomePage, AddEventPage, SignaturePage, PopoverPage, MemberDetailPage, SiteLocationsPage, ResetPasswordPage } from '../pages/pages';
import { AgmCoreModule } from '@agm/core';
import { SQLite } from '@ionic-native/sqlite'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScreenOrientation } from '@ionic-native/screen-orientation'
import { Geolocation } from '@ionic-native/geolocation';
import { environment } from '../environments/environment';
import { Sqlstorage } from '../providers/sqlstorage/sqlstorage';

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
    HomePage,
    AddEventPage,
    SignaturePage,
    PopoverPage,
    MemberDetailPage,
    SiteLocationsPage,
    ResetPasswordPage,
    ParallaxHeaderDirective,
    ParallaxProfileDirective
  ],

  imports: [
    BrowserModule,
    SignaturePadModule,
    HttpClientModule,
    BrowserAnimationsModule,    
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
      pageTransition: 'ios-transition',
      pageTransitionDelay: 16
    }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    })
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddEventPage,
    SignaturePage,
    PopoverPage,
    MemberDetailPage,
    SiteLocationsPage,
    ResetPasswordPage

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
    Calendar,
    AuthService,
    SQLite,
    Sqlstorage
  ]
})
export class AppModule { }
