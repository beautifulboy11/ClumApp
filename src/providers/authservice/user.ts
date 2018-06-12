export interface Roles {
  member?: boolean,
  security?: boolean,
  admin?: boolean
}

export class User {
  uid: string;
  email: string;
  roles: Roles;
  name?: string;
  photoURL?: string;
  displayName?: string;

  constructor(authData) {
    this.uid = authData.uid;
    this.email = authData.email;  
    this.roles = { member: true };
    this.photoURL = authData.photoURL;
    this.displayName = authData.displayName;
  }
}