import { Component } from "@angular/core";
import {
  ViewController,
  NavParams,
  App
} from "ionic-angular";
import { SignaturePage, MemberDetailPage } from "../pages";
import { Member } from "../../models/member";
import { AuthService } from "../../providers/providers";

@Component({
  selector: "page-popover",
  template: `
  <ion-list>    
    <button ion-item (click)="openMemberDetails(member)" *ngIf="authService.isAdmin()">Details</button>
    <button ion-item (click)="showCheckin(member)" *ngIf="authService.isSecurity()">Checkin</button> 
    <button ion-item (click)="showConfirm(member)" *ngIf="authService.isAdmin()">Delete</button>
    <button ion-item (click)="close()">Close</button>
  </ion-list>
`
})
export class PopoverPage {
  member: any;

  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private authService: AuthService,
    public navParams: NavParams,
  ) {
    this.member = navParams.get("member");
  }

  close() {
    this.viewCtrl.dismiss();
  }

  openMemberDetails(member: Member) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(MemberDetailPage, {
      member: member
    });
  }

  showCheckin(member: any) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(SignaturePage, { member: member });   
  }
}
