import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';
import { Calendar } from '@ionic-native/calendar';
@IonicPage()
@Component({
  selector: 'page-content',
  templateUrl: 'content.html'
})
export class ContentPage {
  eventList: any;
  selectedEvent: any;
  isSelected: any;
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  test = [
    { dtstart: '2018-03-08', title: 'Test', eventLocation: 'Kafue' },
    { dtstart: '2018-03-08', title: 'Test', eventLocation: 'Kafue' },
    { dtstart: '2018-03-08', title: 'Test', eventLocation: 'Kafue' }

  ];
  constructor(private alertCtrl: AlertController,
    public navCtrl: NavController,
    private calendar: Calendar,
    public modalCtrl: ModalController) {
    this.date = new Date();

    this.monthNames = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];

    this.getDaysOfMonth();
    this.loadEventThisMonth();
    this.selectDate(this.date.getDay());
  }

  openEvent(event) {
    this.navCtrl.push('EventDetailsPage', event);
  }
    
  addEvent() {
    let modal = this.modalCtrl.create('AddEventPage');
    modal.present();
  }

  checkEvent(day) {
    var hasEvent = false;
    var thisDate1 = new Date(this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00");
    var thisDate2 = new Date(this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59");
    this.eventList.forEach(event => {
      if (((event.dtstart >= thisDate1) && (event.dtstart <= thisDate2)) || ((event.dtend >= thisDate1) && (event.dtend <= thisDate2))) {
        hasEvent = true;
      }
    });
    return hasEvent;
  }

  selectDate(day: any) {
    this.isSelected = false;
    this.selectedEvent = new Array();
    var thisDate1 = Date.parse(this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 00:00:00");
    var thisDate2 = Date.parse(this.date.getFullYear() + "-" + (this.date.getMonth() + 1) + "-" + day + " 23:59:59");

    this.eventList.forEach(event => {
      if ((event.dtstart >= thisDate1) && (event.dtstart <= thisDate2) || ( event.dtstart < thisDate1) && (event.dtend > thisDate2))
      {
        this.isSelected = true;
        this.selectedEvent.push(event);
      }
    });

  }

  deleteEvent(evt) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Are you sure want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Ok',
          handler: () => {
            this.calendar.deleteEvent(evt.title, evt.location, evt.notes, new Date(evt.startDate.replace(/\s/, 'T')), new Date(evt.endDate.replace(/\s/, 'T'))).then(
              (msg) => {              
                this.loadEventThisMonth();
                this.selectDate(new Date(evt.startDate.replace(/\s/, 'T')).getDate());
              },
              (err) => {}
            )
          }
        }
      ]
    });
    alert.present();
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push(i);
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (let i = 0; i < thisNumOfDays; i++) {
      this.daysInThisMonth.push(i + 1);
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    //var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (let i = 0; i < (6 - lastDayThisMonth); i++) {
      this.daysInNextMonth.push(i + 1);
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (let i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push(i);
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
    this.loadEventThisMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
    this.loadEventThisMonth();
  }

  loadEventThisMonth() {
    this.eventList = new Array();
    var startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    var endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    this.calendar.listEventsInRange(startDate, endDate).then(
      (msg) => {
        msg.forEach(item => {
          this.eventList.push(item);
        });
      },
      (err) => {
        alert(err);
      }
    );
  }
}
