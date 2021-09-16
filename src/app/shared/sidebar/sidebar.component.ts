import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  public user!: Usuario;
  public menuItems: any[] = [];

  constructor(
    public sidebarService: SidebarService,
    private usuarioService: UsuarioService
  ) {
    this.user = usuarioService.usuario;
    this.menuItems = sidebarService.menu;
  }

  ngOnInit(): void {}
}
