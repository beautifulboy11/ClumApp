export class Member {

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }

}

export interface Member {
  about: string;
  club: string;
  contact: string;
  membershipNumber: string;
  firstName: string;
  lastName: string;
  status: string;
  profilePic: string
}


