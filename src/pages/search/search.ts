import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  ToastController,
  NavParams
} from "ionic-angular";
import * as _ from "lodash";
import { Api } from "../../providers/providers";
import { Member } from "../../models/member";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html"
})
export class SearchPage {
  currentItems: any = [];
  members: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public api: Api
  ) {}

  ionViewDidLoad() {
    this.api.getMembers().subscribe(
      (resp) => {      
        this.currentItems = resp;       
      },
      (error) => {
        let toast = this.toastCtrl.create({
          position: "bottom",
          message: error,
          showCloseButton: true,
          cssClass: "toast-message",
          closeButtonText: "OK",
          dismissOnPageChange: true
        });
        toast.present();
      }
    );
  }

  getItems(ev) {
    let val = ev.target.value;
    console.log(JSON.stringify(val));
    if (!val || !val.trim()) {
      this.members = [];
      return;
    }
    console.log(JSON.stringify(this.members));
    this.members = this.query({
      firstName: val,
      lastName: val,
      membershipNumber: val
    });
    console.info("**Search Results", this.members);
  }

  query(params?: any) {
    if (!params) {
      return;
    }
    return _.chain(this.currentItems)
      .filter(membersArr => {
        console.log("Member in query ", membersArr);
        for (let key in params) {
          console.log("Params in query ",params);
          let field = membersArr[key];
          console.log("Fiels in Array ",field);
          if (
            _.includes(membersArr, params[key])
            //typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0
          ) {
            return membersArr;
          } else if (field == params[key]) {
            return membersArr;
          }
        }
        return null;
      })
      .map(member => {
        let isActive = member.status === "active";
        let status = isActive ? true : false;
        let chk = status ? "secondary" : "dark";
        let name = this.concatenateName(member.firstName, member.lastName);
        console.log("****");
        return {
          About: member.about,
          Club: member.club,
          Contact: member.contact,
          Name: name,
          MemberShipNumber: member.membershipNumber,
          ProfilePic: member.profilePic,
          Status: status,
          Note: member.status,
          Chk: chk
        };
      })
      .value();
  }

  concatenateName(firstname: string, lastname: string): string {
    return firstname + " " + lastname;
  }

  openItem(item: Member) {
    this.navCtrl.push("MemberDetailPage", {
      item: item
    });
  }
}
