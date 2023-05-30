import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICategoria } from '../../interfaces/Icategoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  baserUrl: string = environment.apiUrl + '/api/Categoria/';

  constructor(private http: HttpClient) { }

  getCategorias() {

    return this.http.get(this.baserUrl);
  }

  getCategoria(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  crearCategoria(categoria: ICategoria) {

    return this.http.post(this.baserUrl, categoria);
  }

  actualizarCategoria(id: number, categoria: ICategoria) {

    return this.http.put(this.baserUrl + id, categoria);
  }

  deleteCategoria(id: number) {

    return this.http.delete(this.baserUrl + id);
  }
}
