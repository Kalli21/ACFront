import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalisisRoutingModule } from './analisis-routing.module';
import { CargaDatosComponent } from './pages/carga-datos/carga-datos.component';
import { ProductoComponent } from './pages/producto/producto.component';
import { GeneralComponent } from './pages/general/general.component';


@NgModule({
  declarations: [
    CargaDatosComponent,
    ProductoComponent,
    GeneralComponent
  ],
  imports: [
    CommonModule,
    AnalisisRoutingModule
  ]
})
export class AnalisisModule { }
