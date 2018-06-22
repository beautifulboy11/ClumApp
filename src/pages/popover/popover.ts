import { Component, OnInit } from "@angular/core";
import {
  ViewController,
  NavParams,
  App,
  IonicPage
} from "ionic-angular";
import { Member } from "../../models/member";
import { AuthService } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-popover",
  template: `
  <ion-list>    
    <button ion-item (click)="openMemberDetails(member)" *ngIf="admin">Details</button>
    <button ion-item (click)="showCheckin(member)" *ngIf="security">Checkin</button> 
    <button ion-item (click)="close()">Close</button>
  </ion-list>
`
})
export class PopoverPage implements OnInit {
  member: any;
  security: boolean;
  admin: boolean;
  constructor(
    public viewCtrl: ViewController,
    public appCtrl: App,
    private authService: AuthService,
    public navParams: NavParams,
  ) {
    this.member = navParams.get("member");
  }

  ngOnInit() {
    this.security = this.authService.isSecurity();
    this.admin = this.authService.isAdmin();
  }
  close() {
    this.viewCtrl.dismiss();
  }

  openMemberDetails(member: Member) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('MemberDetailPage', {
      member: member
    });
  }

  showCheckin(member: any) {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push('SignaturePage', { member: member });
  }
}
