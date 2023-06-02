import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { MenuComponent } from './pages/menu/menu.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuComponent
  ],
})
export class SharedModule { }
