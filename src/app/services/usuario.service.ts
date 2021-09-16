import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { LoadUsers } from '../interfaces/load-users.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';

declare const gapi: any;

const baseUrl = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario!: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role!;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  async googleInit() {
    return new Promise<void>((resolve) => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id:
            '89398295150-i5gfmgmc293t3fuqdno55lfdn2fi194c.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    });
  }

  saveInLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validateToken(): Observable<boolean> {
    return this.http.get(`${baseUrl}/login/renew`, this.headers).pipe(
      map((res: any) => {
        const { email, google, name, role, uid, img = '' } = res.user;
        this.usuario = new Usuario(name, email, '', img, google, role, uid);
        this.saveInLocalStorage(res.token, res.menu);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  createUser(formData: RegisterForm) {
    return this.http.post(`${baseUrl}/usuarios`, formData).pipe(
      tap((res: any) => {
        this.saveInLocalStorage(res.token, res.menu);
      })
    );
  }

  updateUser(data: { email: string; name: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role!,
    };

    return this.http.put(`${baseUrl}/usuarios/${this.uid}`, data, this.headers);
  }

  loginUser(formData: LoginForm) {
    return this.http.post(`${baseUrl}/login`, formData).pipe(
      tap((res: any) => {
        this.saveInLocalStorage(res.token, res.menu);
      })
    );
  }

  loginUserWithGoogle(token: string) {
    return this.http.post(`${baseUrl}/login/google`, { token }).pipe(
      tap((res: any) => {
        this.saveInLocalStorage(res.token, res.menu);
      })
    );
  }

  logoutUser() {
    localStorage.removeItem('token');

    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  loadUsers(from: number = 0, limit: number = 5) {
    const url = `${baseUrl}/usuarios?from=${from}&limit=${limit}`;
    return this.http.get<LoadUsers>(url, this.headers).pipe(
      map((res) => {
        const users = res.usuarios.map(
          (user) =>
            new Usuario(
              user.name,
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            )
        );
        return { total: res.total, users };
      })
    );
  }

  deleteUser(user: Usuario) {
    const url = `${baseUrl}/usuarios/${user.uid}`;
    return this.http.delete(url, this.headers);
  }

  changeUserRole(user: Usuario) {
    return this.http.put(`${baseUrl}/usuarios/${user.uid}`, user, this.headers);
  }
}
