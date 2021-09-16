import { environment } from 'src/environments/environment';

const BASE_URL = environment.BASE_URL;
export class Usuario {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: 'ADMIN_ROLE' | 'USER_ROLE',
    public uid?: string
  ) {}

  get imageUrl(): string {
    if (!this.img) return `${BASE_URL}/upload/usuarios/no-image`;

    if (this.img?.includes('https')) return this.img;

    if (this.img) return `${BASE_URL}/upload/usuarios/${this.img}`;

    return `${BASE_URL}/upload/usuarios/no-image`;
  }
}
