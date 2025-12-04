import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Owner } from '../domain/model/owner.entity';
import { OwnerResource } from './owner.resource';

@Injectable({ providedIn: 'root' })
export class OwnerApiEndpoint {
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/owners`;

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<Owner | null> {
    return this.http.get<OwnerResource>(`${this.baseUrl}/by-user/${userId}`).pipe(
      map(resource => new Owner(resource))
    );
  }
}