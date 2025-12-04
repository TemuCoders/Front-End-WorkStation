import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Freelancer } from '../domain/model/freelancer.entity';
import { FreelancerResource } from './freelancer.resource';

@Injectable({ providedIn: 'root' })
export class FreelancerApiEndpoint {
  private readonly baseUrl = `${environment.platformProviderApiBaseUrl}/freelancers`;

  constructor(private http: HttpClient) {}

  getByUserId(userId: number): Observable<Freelancer | null> {
    return this.http.get<FreelancerResource>(`${this.baseUrl}/by-user/${userId}`).pipe(
      map(resource => new Freelancer(resource))
    );
  }
}