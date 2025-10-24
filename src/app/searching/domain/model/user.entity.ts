
export class User {
  private _firstName: string;
  private _lastName: string;

  constructor(user: {
    firstName: string;
    lastName: string;
  }) {
    this._firstName = user.firstName;
    this._lastName = user.lastName;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

}
