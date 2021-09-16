import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInit(): void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(
    private settingsService: SettingsService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.settingsService.setTheme();
    customInit();
    this.sidebarService.loadMenu();
  }
}
