import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IComentario } from '../../interfaces/predic_sentiment/IComentario';
import { IComentariosFiltros } from '../../interfaces/predic_sentiment/Request/IComentariosFiltros';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  baserUrl: string = environment.apiBackUrl + '/api/Comentario/';

  constructor(private http: HttpClient) { }

  getComentarios() {

    return this.http.get(this.baserUrl);
  }

  getComentario(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  crearComentario(comentario: IComentario) {

    return this.http.post(this.baserUrl, comentario);
  }

  actualizarComentario(id: number, comentario: IComentario) {

    return this.http.put(this.baserUrl + id, comentario);
  }

  deleteComentario(id: number) {

    return this.http.delete(this.baserUrl + id);
  }

  getComentariosConFiltros(username: string, filtro : IComentariosFiltros){
    return this.http.post(this.baserUrl + 'username/' + username, filtro);
  }
}
