import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IProducto } from '../../interfaces/IProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  baserUrl: string = environment.apiUrl + '/api/Producto/';

  constructor(private http: HttpClient) { }

  getProductos() {

    return this.http.get(this.baserUrl);
  }

  getProducto(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  crearProducto(producto: IProducto) {

    return this.http.post(this.baserUrl, producto);
  }

  actualizarProducto(id: number, producto: IProducto) {

    return this.http.put(this.baserUrl + id, producto);
  }

  deleteProducto(id: number) {

    return this.http.delete(this.baserUrl + id);
  }
}