import { Component } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { MessageService } from '../../providers/message-service/message-service';

@Component({
  selector: 'app-messages',
  templateUrl: 'message.html'
})
export  class MessageComponent implements AfterViewInit {
  // _viewCtrl: ViewController;
  // _elementRef: ElementRef;
  d: {
    message?: string;
    cssClass?: string;
    duration?: number;
    showCloseButton?: boolean;
    closeButtonText?: string;
    dismissOnPageChange?: boolean;
    position?: string;
  };
  descId: string;
  dismissTimeout: number;
  enabled: boolean;
  hdrId: string;
  id: number;

  constructor(public messageService: MessageService)
  {};
  ngAfterViewInit(){};
  ionViewDidEnter(){}; 
  dismiss(role: string): any{};
}
