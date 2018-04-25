import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-site-locations',
  templateUrl: 'site-locations.html',
})
export class SiteLocationsPage implements OnInit {

  lat: number = -12.785101573708145;
  lng: number = 28.177270889282227;
  locationSelected: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SiteLocationsPage');
  }

  ngOnInit() {
    this.getUserLocation();
  }

  private getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
    else {
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude
        this.lng = resp.coords.longitude
      }).catch((error) => {
        alert(`Error getting location ${error}`);
      });

    }
    this.locationSelected = true;
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      this.lat = data.coords.latitude
      this.lng = data.coords.longitude
    });
  }

  onLocationChosen(event) {
    console.log(event);
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.locationSelected = true;
  }

  getDirections(event) {
    alert('You will be able to get driving directions');
  }
}
