import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[parallax-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class ParallaxHeaderDirective {
  @Input("header") public header: HTMLElement;

  //public header: any;
  public scrollContent: any;  
  public headerHeight: any;
  public translateAmt: any;
  public scaleAmt: any;
  public scrollTop: any;
  public lastScrollTop: any;
  public ticking: any;

  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello ParallaxHeaderDirective Directive');
  }

  ngOnInit() {
    this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];

    //New
    //this.header = this.scrollContent.firstElementChild;
    //this.headerHeight = this.scrollContent.clientHeight;
    this.headerHeight = this.header.clientHeight;    
    
    this.ticking = false;

    //this.renderer.setElementStyle(this.header, 'webkitTransformOrigin', 'center bottom');    
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 400ms');
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 400ms');

    // window.addEventListener('resize', () => {
    //   this.headerHeight = this.scrollContent.clientHeight;
    // }, false);

    // this.scrollContent.addEventListener('scroll', () => {
    //   if (!this.ticking) {
    //     window.requestAnimationFrame(() => {
    //       this.updateElasticHeader();
    //     });
    //   }
    //   this.ticking = true;
    // });

  }

  onContentScroll(event) {console.log(event);
    this.updateElasticHeader();
    // if (event.scrollTop > 58) {
    //   this.renderer.setElementStyle(this.header, 'top', '-'+ event.scrollTop+'px');
    //   this.renderer.setElementStyle(this.scrollContent, 'margin', '0px');
    // }
    // else {
    //   this.renderer.setElementStyle(this.header, 'top', '0px');
    //   this.renderer.setElementStyle(this.scrollContent, 'margin-top', '0px');
    // }
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

    //this.renderer.setElementStyle(this.header, 'webkitTransform', 'translate3d(0,' + this.translateAmt + 'px,0) scale(' + this.scaleAmt + ',' + this.scaleAmt + ')');
    this.renderer.setElementStyle(this.header, 'top', '-' + this.translateAmt + 'px');
    this.renderer.setElementStyle(this.scrollContent, 'margin-top', '-' + this.translateAmt +'px');
    
    this.ticking = false;
  }

}
