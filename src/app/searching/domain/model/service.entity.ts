import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Service implements BaseEntity{
  private _id: number;
  private _spaceId: number;
  private _name: string;
  private _description: string;
  private _price: number;

  constructor(service: { id: number; spaceId:number;name: string; price: number; description: string }) {
    this._id = service.id;
    this._spaceId = service.spaceId;
    this._name = service.name;
    this._description = service.description;
    this._price = service.price;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get spaceId(): number {
    return this._spaceId;
  }

  set spaceId(value: number) {
    this._spaceId = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get price(): number {
    return this._price;
  }

  set price(value: number) {
    this._price = value;
  }
}
