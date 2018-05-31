import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[parallax-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class ParallaxHeaderDirective {
  @Input("header") public header: HTMLElement;

  public scrollContent: any;  
  public headerHeight: any;
  public translateAmt: any;
  public scaleAmt: any;
  public scrollTop: any;
  public lastScrollTop: any;
  public ticking: any;

  constructor(public element: ElementRef, public renderer: Renderer) {}

  ngOnInit() {
    this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.headerHeight = this.header.clientHeight;        
    this.ticking = false;   
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 400ms');
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 400ms');
  }

  onContentScroll(event) {
    this.updateElasticHeader(); 
  }

  public updateElasticHeader() {
    this.scrollTop = this.scrollContent.scrollTop;
    if (this.scrollTop >= 0) {
      this.translateAmt = this.scrollTop / 2;
      this.scaleAmt = 1;
    }
    else {
      this.translateAmt = 0;
      this.scaleAmt = -this.scrollTop / this.headerHeight + 1;
    }

    this.renderer.setElementStyle(this.header, 'top', '-' + this.translateAmt + 'px');
    this.renderer.setElementStyle(this.scrollContent, 'margin-top', '-' + this.translateAmt +'px');    
    this.ticking = false;
  }

}
