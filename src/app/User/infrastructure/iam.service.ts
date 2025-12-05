import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
// ⚠️ Ajusta el path del environment según tu estructura real
import { environment } from '../../../environments/environment';

export interface SignInRequest {
  username: string;      // usaremos el email como username
  password: string;
}

export interface SignInResponse {
  id: number;
  username: string;
  token: string;
  roles?: any;           // opcional, por si el backend envía roles
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  // cualquier otro campo que tu backend reciba
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class IamService {
  private readonly http = inject(HttpClient);

  // En tu environment debe existir: platformProviderApiBaseUrl: 'http://localhost:8092/api/v1'
  private readonly baseUrl = environment.platformProviderApiBaseUrl;

  private readonly TOKEN_KEY = 'jwt_token';

  /** Login contra el IAM */
  signIn(username: string, password: string): Observable<SignInResponse> {
    const body: SignInRequest = { username, password };

    return this.http
      .post<SignInResponse>(`${this.baseUrl}/authentication/sign-in`, body)
      .pipe(
        tap(res => {
          // guardamos token automáticamente
          if (res.token) {
            this.saveToken(res.token);
          }
        })
      );
  }

  /** Registro contra el IAM */
  signUp(payload: SignUpRequest): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(
      `${this.baseUrl}/authentication/sign-up`,
      payload
    );
  }

  /** Guarda o limpia el token en localStorage */
  saveToken(token: string | null): void {
    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    } else {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /** Usado por el interceptor JWT */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /** Útil para logout */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /** Helper por si lo quieres usar en guards, etc. */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
