import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public auth2: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.renderButton();
  }

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    rememberMe: [localStorage.getItem('remember') || false],
  });

  loginUser() {
    this.usuarioService.loginUser(this.loginForm.value).subscribe(
      (res) => {
        if (this.loginForm.get('rememberMe')?.value) {
          localStorage.setItem('email', this.loginForm.get('email')?.value);
          localStorage.setItem(
            'remember',
            this.loginForm.get('rememberMe')?.value
          );
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('remember');
        }
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });

    this.startApp();
  }

  startApp() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          '89398295150-i5gfmgmc293t3fuqdno55lfdn2fi194c.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2')!);
    });
  }

  attachSignin(element: HTMLElement) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser: any) => {
        const googleToken = googleUser.getAuthResponse().id_token;

        this.usuarioService
          .loginUserWithGoogle(googleToken)
          .subscribe((res) => {
            this.ngZone.run(() => {
              this.router.navigateByUrl('/dashboard');
            });
          });
      },
      (error: any) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
