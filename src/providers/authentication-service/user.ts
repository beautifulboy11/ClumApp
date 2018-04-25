export interface Roles {
  member?: boolean,
  security?: boolean,
  admin?: boolean
}

export class User {
  uid: string;
  email: string;
  roles: Roles;

  constructor(authData) {
    this.uid = authData.uid;
    this.email = authData.email
    this.roles = { member: true }

  }
}