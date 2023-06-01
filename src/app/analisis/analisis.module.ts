import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalisisRoutingModule } from './analisis-routing.module';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button'; 

import { CargaDatosComponent } from './pages/carga-datos/carga-datos.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { GeneralComponent } from './pages/general/general.component';
import { DataModalComponent } from './pages/data-modal/data-modal.component';


@NgModule({
  declarations: [
    CargaDatosComponent,
    ProductoComponent,
    GeneralComponent,
    DataModalComponent
  ],
  imports: [
    CommonModule,
    AnalisisRoutingModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ],
})
export class AnalisisModule { }
