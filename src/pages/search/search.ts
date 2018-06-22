import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, ToastController } from "ionic-angular";
import { DataService } from "../../providers/providers";
import { Member } from "../../models/member";
import { MessageService } from "../../providers/message-service/message-service";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage implements OnInit {
  currentItems: any = [];
  members: any;
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public api: DataService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.getMembers();
  }
  getMembers() {
    this.api.getCollection("/members", true, true).subscribe(
      resp => {
        this.currentItems = resp;
      },
      error => {
        this.messageService.add(error);
      }
    );
  }
  
  getItems(ev) {
    let val = ev.target.value;

    if (!val || !val.trim()) {
      this.members = [];
      return;
    }

    this.members = this.api.query({
      firstName: val,
      lastName: val,
      membershipNumber: val
    });
  }

  openItem(item: Member) {
    this.navCtrl.push("MemberDetailPage", {
      item: item
    });
  }
}
