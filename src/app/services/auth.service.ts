import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserProfile {
  displayName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly base = `${environment.apiUrl}/auth`;

  login(request: LoginRequest) {
    return this.http.post<UserProfile>(
      `${this.base}/login`,
      request
    );
  }

  getCurrentUser() {
    return this.http.get<UserProfile>(
      `${this.base}/me`
    );
  }

  initializeXsrf() {
    return this.http.get<void>(
      `${this.base}/xsrf`
    );
  }
}