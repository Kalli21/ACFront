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
import { WordCloudComponent } from './graficos/word-cloud/word-cloud.component';
import { TagCloudComponent } from 'angular-tag-cloud-module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CardProductoComponent } from './shared/card-producto/card-producto.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { BarHorizontalV2Component } from './graficos/bar-horizontal-v2/bar-horizontal-v2.component';
import { TablaComentariosComponent } from './graficos/tabla-comentarios/tabla-comentarios.component';
import { FiltrosPaginaProductosComponent } from './shared/filtros/filtros-pagina-productos/filtros-pagina-productos.component';
import { FiltrosPaginaGeneralComponent } from './shared/filtros/filtros-pagina-general/filtros-pagina-general.component';
import {  MatProgressBarModule } from '@angular/material/progress-bar';

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
    WordCloudComponent,
    CardProductoComponent,
    BarHorizontalV2Component,
    TablaComentariosComponent,
    FiltrosPaginaProductosComponent,
    FiltrosPaginaGeneralComponent,
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
    MatListModule,
    TagCloudComponent,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatSelectModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressBarModule
  ],
})
export class AnalisisModule {}
