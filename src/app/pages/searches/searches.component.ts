import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchesService } from '../../services/searches.service';

import { Usuario } from '../../models/usuario.model';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';

@Component({
  selector: 'app-searches',
  templateUrl: './searches.component.html',
  styles: [],
})
export class SearchesComponent implements OnInit {
  public users: Usuario[] = [];
  public medics: Medico[] = [];
  public hospitals: Hospital[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private searchesService: SearchesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ term }) => {
      this.globalSearch(term);
    });
  }

  globalSearch(term: string) {
    this.searchesService.globalSearch(term).subscribe((res: any) => {
      this.users = res.usuarios;
      this.medics = res.medicos;
      this.hospitals = res.hospitales;
    });
  }
  openMedic(medic: Medico) {
    this.router.navigate(['dashboard', 'medics', medic._id]);
  }
}
