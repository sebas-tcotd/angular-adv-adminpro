import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canLoad() {
    return this.usuarioService.validateToken().pipe(
      tap((isUserLogged) => {
        if (!isUserLogged) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }

  canActivate() {
    return this.usuarioService.validateToken().pipe(
      tap((isUserLogged) => {
        if (!isUserLogged) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
