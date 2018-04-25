import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[parallax-header]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class ParallaxHeaderDirective {
  @Input("header") header: HTMLElement;
   headerHeight: any;
   scrollContent: any;

  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello ParallaxHeaderDirective Directive');
  }

  ngOnInit(){
    this.headerHeight = this.header.clientHeight;
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 700ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName("scroll-content")[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 700ms');
  }

  onContentScroll(event){
    if (event.scrollTop > 58) {
      this.renderer.setElementStyle(this.header, 'top','-56px'); 
      this.renderer.setElementStyle(this.scrollContent, 'margin','0px');  
    }
    else
    {
      this.renderer.setElementStyle(this.header, 'top','0px');  
      this.renderer.setElementStyle(this.scrollContent, 'margin-top','0px');  
    }   
    console.log(event);
  }
 
}
