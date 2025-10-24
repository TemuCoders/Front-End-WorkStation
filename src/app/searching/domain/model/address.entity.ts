export class Address {
  private _street: string;
  private _number: number;
  private _district: string;
  private _city: string;

  constructor(address: {
    street: string;
    number: number;
    district: string;
    city: string;
  }) {
    this._street = address.street;
    this._number = address.number;
    this._district = address.district;
    this._city = address.city;
  }

  get street(): string {
    return this._street;
  }

  set street(value: string) {
    this._street = value;
  }

  get number(): number {
    return this._number;
  }

  set number(value: number) {
    this._number = value;
  }

  get district(): string {
    return this._district;
  }

  set district(value: string) {
    this._district = value;
  }

  get city(): string {
    return this._city;
  }

  set city(value: string) {
    this._city = value;
  }

}
