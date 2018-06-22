import { Component, ViewChild } from "@angular/core";
import { Slides, SegmentButton, IonicPage } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-e2e",
  templateUrl: "e2e.html"
})

export class E2EPage {
  @ViewChild("loopSlider") sliderComponent: Slides;

  selectedSegment = "first";
  slides = [
    {
      id: "first",
      title: "First Slide"
    },
    {
      id: "second",
      title: "Second Slide"
    },
    {
      id: "third",
      title: "Third Slide"
    }
  ];

  constructor() {}

  onSegmentChanged(segmentButton: SegmentButton) {
    const selectedIndex = this.slides.findIndex(slide => {
      return slide.id === segmentButton.value;
    });
    this.sliderComponent.slideTo(selectedIndex);
  }

  onSlideChanged(s: Slides) {
    const currentSlide = this.slides[s.getActiveIndex()];
    this.selectedSegment = currentSlide.id;
  }
}
