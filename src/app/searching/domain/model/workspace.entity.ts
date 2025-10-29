import {BaseEntity} from '../../../shared/infrastructure/base-entity';
import {Address} from './address.entity';
import {User} from './user.entity';
import {Service} from './service.entity';

export class Workspace implements BaseEntity {
  private _id: number;
  private _name: string;
  private _description: string;
  private _type: string;
  private _capacity: number;
  private _pricePerDay: number;
  private _isAvailable: boolean;
  private _averageRating: number;
  private _imageUrl: string;
  private _address: Address;
  private _owner: User;
  private _services: Service[];

  constructor(workspace: {
    id: number;
    name: string;
    description: string;
    type: string;
    capacity: number;
    pricePerDay: number;
    isAvailable: boolean;
    averageRating: number;
    imageUrl: string;
    address: Address;
    owner: User;
    services: Service[];
  }) {
    this._id = workspace.id;
    this._name = workspace.name;
    this._description = workspace.description;
    this._type = workspace.type;
    this._capacity = workspace.capacity;
    this._pricePerDay = workspace.pricePerDay;
    this._isAvailable = workspace.isAvailable;
    this._averageRating = workspace.averageRating;
    this._imageUrl = workspace.imageUrl;
    this._address = workspace.address;
    this._owner = workspace.owner;
    this._services = workspace.services;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
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

  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }

  get capacity(): number {
    return this._capacity;
  }
  set capacity(value: number) {
    this._capacity = value;
  }

  get pricePerDay(): number {
    return this._pricePerDay;
  }
  set pricePerDay(value: number) {
    this._pricePerDay = value;
  }

  get isAvailable(): boolean {
    return this._isAvailable;
  }
  set isAvailable(value: boolean) {
    this._isAvailable = value;
  }

  get averageRating(): number {
    return this._averageRating;
  }
  set averageRating(value: number) {
    this._averageRating = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
  set imageUrl(value: string) {
    this._imageUrl = value;
  }

  get address(): Address {
    return this._address;
  }
  set address(value: Address) {
    this._address = value;
  }

  get owner(): User {
    return this._owner;
  }
  set owner(value: User) {
    this._owner = value;
  }

  get services(): Service[] {
    return this._services;
  }
  set services(value: Service[]) {
    this._services = value;
  }
}
