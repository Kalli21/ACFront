import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaDatosComponent } from './pages/carga-datos/carga-datos.component';
import { GeneralComponent } from './pages/general/general.component';
import { ProductoComponent } from './pages/producto/producto.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'cargadatos', component: CargaDatosComponent },
      { path: 'general', component: GeneralComponent },
      { path: 'producto', component: ProductoComponent },
      { path: '**', redirectTo: 'cargadatos', pathMatch: 'full' },
      { path: '*', redirectTo: 'cargadatos', pathMatch: 'full' },
      { path: '', redirectTo: 'cargadatos', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalisisRoutingModule { }
