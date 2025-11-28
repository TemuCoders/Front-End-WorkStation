import {BaseEntity} from '../../../shared/infrastructure/base-entity';
import {Address} from './address.entity';


export class Workspace implements BaseEntity {
  private _id: number;
  private _ownerId: number;
  private _spaceType: string;
  private _name: string;
  private _description: string;
  private _capacity: number;
  private _price: number;
  private _available: boolean;
  private _img: string;
  private _address: Address;

  constructor(workspace: {
    id: number;
    ownerId: number;
    name: string;
    description: string;
    spaceType: string;
    capacity: number;
    price: number;
    available: boolean;
    img: string;
    address: Address;
  }) {
    this._id = workspace.id;
    this._ownerId = workspace.ownerId;
    this._name = workspace.name;
    this._description = workspace.description;
    this._spaceType = workspace.spaceType;
    this._capacity = workspace.capacity;
    this._price = workspace.price;
    this._available = workspace.available;
    this._img = workspace.img;
    this._address = workspace.address;
  }

  get id(): number {
    return this._id;
  }

  get ownerId(): number {
    return this._ownerId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get spaceType(): string {
    return this._spaceType;
  }

  get capacity(): number {
    return this._capacity;
  }

  get price(): number {
    return this._price;
  }

  get available(): boolean {
    return this._available;
  }

  get img(): string {
    return this._img;
  }

  get address(): Address {
    return this._address;
  }
}
