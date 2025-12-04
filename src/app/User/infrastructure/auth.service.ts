import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';
import { User } from '../domain/model/user.entity';
import { Freelancer } from '../domain/model/freelancer.entity';
import { Owner } from '../domain/model/owner.entity';
import { UserApi } from './user-api.service';
import { FreelancerApiEndpoint } from '../infrastructure/freelancer-api.endpoint';
import { OwnerApiEndpoint } from '../infrastructure/owner-api.endpoint';
import { RegisterUserRequest } from './register-user.request';
import { UpdateUserProfileRequest } from './update-user-profile';

interface AuthState {
  user: User | null;
  freelancerProfile: Freelancer | null;
  ownerProfile: Owner | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSignal = signal<AuthState>({
    user: null,
    freelancerProfile: null,
    ownerProfile: null
  });

  private userApi = inject(UserApi);
  private freelancerApi = inject(FreelancerApiEndpoint);
  private ownerApi = inject(OwnerApiEndpoint);

  // Computed signals
  currentUser = computed(() => this.authStateSignal().user);
  freelancerProfile = computed(() => this.authStateSignal().freelancerProfile);
  ownerProfile = computed(() => this.authStateSignal().ownerProfile);
  isAuthenticated = computed(() => this.authStateSignal().user !== null);

  constructor() {
    this.loadAuthStateFromStorage();
  }

  private loadAuthStateFromStorage(): void {
    const stored = localStorage.getItem('authState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.authStateSignal.set({
          user: parsed.user ? new User(parsed.user) : null,
          freelancerProfile: parsed.freelancerProfile ? new Freelancer(parsed.freelancerProfile) : null,
          ownerProfile: parsed.ownerProfile ? new Owner(parsed.ownerProfile) : null
        });
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
        localStorage.removeItem('authState');
      }
    }
  }

  private saveAuthStateToStorage(state: AuthState): void {
    localStorage.setItem('authState', JSON.stringify(state));
  }

  // ✅ CORREGIDO: Ahora devuelve un Observable para que puedas esperarlo
  login(user: User): Observable<AuthState> {
    const freelancerObs = user.isFreelancer() 
      ? this.freelancerApi.getByUserId(user.id).pipe(catchError(() => of(null)))
      : of(null);

    const ownerObs = user.isOwner()
      ? this.ownerApi.getByUserId(user.id).pipe(catchError(() => of(null)))
      : of(null);

    return forkJoin({
      freelancer: freelancerObs,
      owner: ownerObs
    }).pipe(
      map(({ freelancer, owner }) => {
        const newState: AuthState = {
          user,
          freelancerProfile: freelancer,
          ownerProfile: owner
        };
        this.authStateSignal.set(newState);
        this.saveAuthStateToStorage(newState);
        return newState;
      }),
      catchError((err) => {
        console.error('Error loading profiles:', err);
        const newState: AuthState = {
          user,
          freelancerProfile: null,
          ownerProfile: null
        };
        this.authStateSignal.set(newState);
        this.saveAuthStateToStorage(newState);
        return of(newState);
      })
    );
  }

  register(request: RegisterUserRequest): Observable<User> {
    return this.userApi.createUser(request).pipe(
      switchMap(user => this.login(user).pipe(map(() => user)))
    );
  }

  logout(): void {
    this.authStateSignal.set({
      user: null,
      freelancerProfile: null,
      ownerProfile: null
    });
    localStorage.removeItem('authState');
  }

  updateUser(id: number, request: UpdateUserProfileRequest): Observable<User> {
    return this.userApi.updateUser(id, request).pipe(
      tap(user => {
        const currentState = this.authStateSignal();
        const newState: AuthState = {
          ...currentState,
          user
        };
        this.authStateSignal.set(newState);
        this.saveAuthStateToStorage(newState);
      })
    );
  }

  // Métodos de utilidad
  getUserId(): number | null {
    return this.currentUser()?.id || null;
  }

  getFreelancerId(): number | null {
    return this.freelancerProfile()?.id || null;
  }

  getOwnerId(): number | null {
    return this.ownerProfile()?.id || null;
  }

  isFreelancer(): boolean {
    return this.currentUser()?.isFreelancer() || false;
  }

  isOwner(): boolean {
    return this.currentUser()?.isOwner() || false;
  }

  getCurrentRoleId(): number | null {
    if (this.isFreelancer()) {
      return this.getFreelancerId();
    }
    if (this.isOwner()) {
      return this.getOwnerId();
    }
    return null;
  }
}