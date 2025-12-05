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
import { IamService } from '../infrastructure/iam.service';

interface AuthState {
  user: User | null;
  freelancerProfile: Freelancer | null;
  ownerProfile: Owner | null;
  token: string | null; // ⬅️ nuevo campo para el token
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSignal = signal<AuthState>({
    user: null,
    freelancerProfile: null,
    ownerProfile: null,
    token: null
  });

  private userApi = inject(UserApi);
  private freelancerApi = inject(FreelancerApiEndpoint);
  private ownerApi = inject(OwnerApiEndpoint);
  private iamService = inject(IamService);

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
    const tokenFromIam = this.iamService.getToken();

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.authStateSignal.set({
          user: parsed.user ? new User(parsed.user) : null,
          freelancerProfile: parsed.freelancerProfile ? new Freelancer(parsed.freelancerProfile) : null,
          ownerProfile: parsed.ownerProfile ? new Owner(parsed.ownerProfile) : null,
          token: parsed.token ?? tokenFromIam ?? null
        });
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
        localStorage.removeItem('authState');
        this.authStateSignal.set({
          user: null,
          freelancerProfile: null,
          ownerProfile: null,
          token: tokenFromIam ?? null
        });
      }
    } else {
      // No había authState, pero puede existir token del IAM
      this.authStateSignal.set({
        user: null,
        freelancerProfile: null,
        ownerProfile: null,
        token: tokenFromIam ?? null
      });
    }
  }

  private saveAuthStateToStorage(state: AuthState): void {
    const stateWithToken: AuthState = {
      ...state,
      token: state.token ?? this.iamService.getToken() ?? null
    };
    localStorage.setItem('authState', JSON.stringify(stateWithToken));
  }

  /**
   * Login clásico con un User (compatibilidad hacia atrás).
   * Se sigue usando internamente para cargar perfiles.
   */
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
          ownerProfile: owner,
          token: this.iamService.getToken()
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
          ownerProfile: null,
          token: this.iamService.getToken()
        };
        this.authStateSignal.set(newState);
        this.saveAuthStateToStorage(newState);
        return of(newState);
      })
    );
  }

  /**
   * 🔐 NUEVO: Login contra IAM usando email + password
   * 1) POST /authentication/sign-in
   * 2) Guarda token (IamService)
   * 3) GET /users/{id}
   * 4) Reusa this.login(user) para cargar perfiles
   */
  loginWithCredentials(email: string, password: string): Observable<AuthState> {
    return this.iamService.signIn(email, password).pipe(
      switchMap(signInResponse =>
        this.userApi.getUser(signInResponse.id).pipe(
          switchMap(user => this.login(user)),
          map(authState => {
            const newState: AuthState = {
              ...authState,
              token: signInResponse.token
            };
            this.authStateSignal.set(newState);
            this.saveAuthStateToStorage(newState);
            return newState;
          })
        )
      )
    );
  }

  /**
   * Registro usando IAM + creación de User + login automático.
   * Ajusta si tu backend espera otros campos.
   */
  register(request: RegisterUserRequest): Observable<User> {
    const anyReq: any = request;

    const signUpPayload: any = {
      ...request,
      username: anyReq.email ?? anyReq.username,
      email: anyReq.email,
      password: anyReq.password
    };

    return this.iamService.signUp(signUpPayload).pipe(
      switchMap(() => this.userApi.createUser(request)),
      switchMap(user =>
        this.loginWithCredentials(anyReq.email, anyReq.password).pipe(
          map(() => user)
        )
      )
    );
  }

  logout(): void {
    this.authStateSignal.set({
      user: null,
      freelancerProfile: null,
      ownerProfile: null,
      token: null
    });
    localStorage.removeItem('authState');
    this.iamService.clearToken(); // ⬅️ limpia el token del IAM
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

  // 🔑 Exponer el token si lo necesitas en alguna parte
  getToken(): string | null {
    return this.iamService.getToken();
  }
}
