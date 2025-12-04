import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { User } from '../domain/model/user.entity';
import { UserApiEndpoint } from './user-api.endpoint';
import { RegisterUserRequest } from './register-user.request';
import { UpdateUserProfileRequest } from './update-user-profile';

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

  createUser(request: RegisterUserRequest): Observable<User> {
    return this.usersEndpoint.create(request);
  }

  updateUser(id: number, request: UpdateUserProfileRequest): Observable<User> {
    return this.usersEndpoint.update(id, request);
  }

  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }
}