import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProducto } from '../../interfaces/predic_sentiment/IProducto';
import { IProductosFiltros } from '../../interfaces/predic_sentiment/Request/IProductosFiltros';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  baserUrl: string = environment.webApiUrl + '/Producto/';

  constructor(private http: HttpClient) { }

  getProducto(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  getProductosConFiltros(userid: number,filtros: IProductosFiltros ){

    return this.http.post(this.baserUrl +"username/" + userid, filtros )
  }

}
