import { Component, OnInit } from "@angular/core";
import {
  IonicPage,
  ModalController,
  NavController,
  LoadingController,
  PopoverController,
} from "ionic-angular";
import { PopoverPage, MemberDetailPage } from "../pages";
import { Observable } from "rxjs";
//import { AuthService } from "../../providers/providers";
//import { User } from "../../providers/authservice/user";
import { DataService, MessageService } from "../../providers/providers";

@IonicPage()
@Component({
  selector: "page-member",
  templateUrl: "member.html"
})
export class MemberPage implements OnInit {
  club: string;
  members: any = [];
  mufMembers: any = [];
  loading: any;
  public signatureImage: any;
  profileUrl: Observable<string | null>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  disconnectSubscription: any;
  connectSubscription: any;

  constructor(
    private api: DataService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private message: MessageService,
    // private authService: AuthService
  ) {
    this.club = "Nkana";
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers(): any {
    this.loading = this.loadingCtrl.create({
      content: "Loading...",
      spinner: "dots",
      showBackdrop: false
    });

    this.loading.present().then(() => {
      this.api.get("/members", true, true).subscribe(
        res => {
          this.members = [];
          this.mufMembers = [];
          res.forEach(resp => {
            if (resp.club === "Nkana") {
              this.members.push(resp);
            } else {
              this.mufMembers.push(resp);
            }
          });
          this.loading.dismiss();
        },
        error => {
          this.loading.dismiss().then(() => {
            this.message.add(error.message);
          });
        }
      );
    });
  }

  showPopOver($event, member: any) {
    let popover = this.popoverCtrl.create(PopoverPage, { member: member });
    popover.present({
      ev: $event
    });
  }

  addMember() {
    let addModal = this.modalCtrl.create("MemberCreatePage");
    addModal.onDidDismiss(member => {
      if (member) {
        () => { this.api.post("/members", member) };
      }
    });
    addModal.present();
  }

  openMemberDetails(member: any) {
    this.navCtrl.push(MemberDetailPage, {
      member: member
    });
  }

  uploadFile(event) {
    //const file = event.target.files[0];
    //const filePath = "name-your-file-path-here";
    //const task = this.storage.upload(filePath, file);
  }
}
