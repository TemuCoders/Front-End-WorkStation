import {BaseEntity} from '../../../shared/infrastructure/base-entity';

export class Service implements BaseEntity{
  private _id: number;
  private _name: string;
  private _icon: string;
  private _description: string;

  constructor(service: { id: number; name: string; icon: string; description: string }) {
    this._id = service.id;
    this._name = service.name;
    this._icon = service.icon;
    this._description = service.description;
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

  get icon(): string {
    return this._icon;
  }

  set icon(value: string) {
    this._icon = value;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }
}
