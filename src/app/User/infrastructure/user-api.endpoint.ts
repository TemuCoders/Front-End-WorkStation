import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { UserResource, UserResponse } from './resources';
import { UserAssembler } from './user.assembler';
import { RegisterUserRequest } from './register-user.request';
import { UpdateUserProfileRequest } from './update-user-profile';

@Injectable({ providedIn: 'root' })
export class UserApiEndpoint {
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/users`;
  private readonly assembler = new UserAssembler();

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<UserResource[]>(this.baseUrl).pipe(
      map(resources => resources.map(r => this.assembler.toEntityFromResource(r)))
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<UserResource>(`${this.baseUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  create(request: RegisterUserRequest): Observable<User> {
    return this.http.post<UserResource>(this.baseUrl, request).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  update(id: number, request: UpdateUserProfileRequest): Observable<User> {
    return this.http.put<UserResource>(`${this.baseUrl}/${id}`, request).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}