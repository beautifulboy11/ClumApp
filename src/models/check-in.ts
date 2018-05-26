export class CheckIn {
  // private _date: string;
  // private _memberId: string;
  // private _signature: string;
  // constructor(public date: string, memberId: string, signature: string) {
  //   this._date = date;
  //   this._memberId = memberId;
  //   this._signature = signature;
  // }
  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}

export interface CheckIn {
  date: string;
  memberId: string;
  signature: string;
}

