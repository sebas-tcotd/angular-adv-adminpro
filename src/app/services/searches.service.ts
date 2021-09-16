import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Search } from '../interfaces/search.interface';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const baseUrl = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class SearchesService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private _transformUsers(results: Usuario[]): Usuario[] {
    return results.map(
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
  }

  private _transformHospitals(results: Hospital[]): Hospital[] {
    return results.map(
      (hospital) =>
        new Hospital(hospital.name, hospital._id, hospital.img, hospital.user)
    );
  }

  private _transformMedics(results: Medico[]): Medico[] {
    return results.map(
      (medico) =>
        new Medico(
          medico._id,
          medico.name,
          medico.img,
          medico.user,
          medico.hospital
        )
    );
  }

  search(type: 'usuarios' | 'medicos' | 'hospitales', term: string) {
    const url = `${baseUrl}/todo/colection/${type}/${term}`;

    return this.http.get<Search>(url, this.headers).pipe(
      map((res) => {
        switch (type) {
          case 'usuarios':
            return this._transformUsers(res.resultados as Usuario[]);

          case 'hospitales':
            return this._transformHospitals(res.resultados as Hospital[]);

          case 'medicos':
            return this._transformMedics(res.resultados as Medico[]);

          default:
            return [];
        }
      })
    );
  }

  globalSearch(term: string) {
    const url = `${baseUrl}/todo/${term}`;
    return this.http.get(url, this.headers);
  }
}
