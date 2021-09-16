import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ModalImageComponent } from './modal-image/modal-image.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    HeaderComponent,
    SidebarComponent,
    ModalImageComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [
    BreadcrumbComponent,
    HeaderComponent,
    SidebarComponent,
    ModalImageComponent,
  ],
})
export class SharedModule {}
