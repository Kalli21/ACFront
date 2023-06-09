import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalisisRoutingModule } from './analisis-routing.module';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; 
import { MatPaginatorModule } from '@angular/material/paginator'; 

import { CargaDatosComponent } from './pages/carga-datos/carga-datos.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { GeneralComponent } from './pages/general/general.component';
import { DataModalComponent } from './pages/data-modal/data-modal.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CircularComponent } from './graficos/circular/circular.component';
import { BarHorizontalComponent } from './graficos/bar-horizontal/bar-horizontal.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MapTreeComponent } from './graficos/map-tree/map-tree.component';
import { BarVerticalComponent } from './graficos/bar-vertical/bar-vertical.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CargaDatosComponent,
    ProductoComponent,
    GeneralComponent,
    DataModalComponent,
    CircularComponent,
    BarHorizontalComponent,
    MapTreeComponent,
    BarVerticalComponent,
  ],
  imports: [
    CommonModule,
    AnalisisRoutingModule,
    MatDialogModule, 
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxChartsModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatListModule
  ],
})
export class AnalisisModule { }
