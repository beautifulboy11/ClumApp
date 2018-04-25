import { Component, ViewChild, trigger, transition, style, state, animate, keyframes } from '@angular/core';
import { IonicPage, MenuController, NavController, Slides } from 'ionic-angular';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html',
  animations: [
    trigger('bounce', [
      state('*', style({
        transform: 'translateX(0)'
      })),
      transition('* => rightSwipe', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(-65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ]))),
      transition('* => leftSwipe', animate('700ms ease-out', keyframes([
        style({ transform: 'translateX(0)', offset: 0 }),
        style({ transform: 'translateX(65px)', offset: .3 }),
        style({ transform: 'translateX(0)', offset: 1 })
      ])))
    ])
  ]
})
export class SlidePage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Skip";
  state: string = 'x';

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  skip() {
    this.navCtrl.push('LoginPage');
  }

  slideChanged() {
    if (this.slides.isEnd()) {
      this.skipMsg = "Alright, I got it";
    } else {
      this.skipMsg = "Skip";
    }
  }

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }

  animationDone() {
    this.state = 'x';
  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    this.menu.enable(true);
  }

}
