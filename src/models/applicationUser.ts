// export class ApplicationUser {
//   constructor(fields: any) {
//     for (const f in fields) {
//       this[f] = fields[f];
//     }
//   }
// }

// export interface ApplicationUser {
//   email: string;
//   password: string;
// }

export class ApplicationUser {
  constructor(
  public email: string,
  public password: string,){}
}

