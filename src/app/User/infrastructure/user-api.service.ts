import { Injectable } from '@angular/core';
import {BaseApi} from '../../shared/infrastructure/base-api';
import { User } from '../domain/model/user.entity';
import {HttpClient} from '@angular/common/http';
import {UserApiEndpoint} from './user-api.endpoint';
import {Observable} from 'rxjs';
import {UserAssembler} from './user.assembler';

@Injectable({ providedIn: 'root' })
export class UserApi extends BaseApi {
  private readonly usersEndpoint: UserApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.usersEndpoint = new UserApiEndpoint(http);
  }

  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }
  getUser(id: number): Observable<User> {
    return this.usersEndpoint.getById(id);
  }
  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }
  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }
  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }
}
