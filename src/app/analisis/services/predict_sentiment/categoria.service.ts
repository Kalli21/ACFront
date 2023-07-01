import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICategoria } from '../../interfaces/predic_sentiment/ICategoria';
import { ICategoriasFiltros } from '../../interfaces/predic_sentiment/Request/ICategoriasFiltros';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  baserUrl: string = environment.apiBackUrl + '/api/Categoria/';

  constructor(private http: HttpClient) { }

  getCategorias(username:string) {
    return this.http.get(this.baserUrl + 'username/' + username);
  }

  getCategoriabyname(username:string,name: string) {

    return this.http.get(this.baserUrl + 'username/cat/'+username+'/'+name);
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

  getCategoriasConComentariosConFiltros(username: string, filtros: ICategoriasFiltros){
    
    return this.http.post(this.baserUrl + 'username/coment/'+username,filtros);
  }

}
