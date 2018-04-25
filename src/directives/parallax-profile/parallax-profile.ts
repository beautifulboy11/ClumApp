import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[parallax-profile]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class ParallaxProfileDirective {
  header: any;
  scrollContent: any;
  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello ParallaxProfileDirective Directive');
  }

  ngOnInit() {
    this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
    this.header = this.scrollContent.getElementsByClassName("toolbar-content")[0]
    this.header = this.scrollContent.getElementsByClassName("main-content")[0]
    this.renderer.setElementStyle(this.header, 'webTransformOrigin', 'center bottom');
  }
  onContentScroll(event) {
    console.log('***Parallax',event);
  }



}
