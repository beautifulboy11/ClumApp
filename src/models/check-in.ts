export class Checkin {

  constructor(fields: any) {
    for (const f in fields) {
      this[f] = fields[f];
    }
  }
}

export interface Checkin {
  date: string;
  memberId: string;
  signature: string;
}

