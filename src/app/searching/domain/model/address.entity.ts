export class Address {
  private _street: string;
  private _number: number;
  private _city: string;
  private _postalCode: number;

  constructor(address: {
    street: string;
    number: number;
    city: string;
    postalCode: number;
  }) {
    this._street = address.street;
    this._number = address.number;
    this._city = address.city;
    this._postalCode = address.postalCode;
  }

  get street(): string {
    return this._street;
  }

  set street(value: string) {
    this._street = value;
  }

  get postalCode(): number {
    return this._postalCode;
  }

  set postalCode(value: number) {
    this._postalCode = value;
  }

  get number(): number {
    return this._number;
  }

  set number(value: number) {
    this._number = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

}
