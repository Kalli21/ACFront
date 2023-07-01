import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClasModelCom } from '../../interfaces/clasModel/IClasModel';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { ICategoria } from '../../interfaces/predic_sentiment/ICategoria';
import { IFiltroPaginaGeneral } from '../../interfaces/clasModel/request/IFiltroPaginaGeneral';

@Injectable({
  providedIn: 'root'
})
export class SentimentPredictService {

  baserUrl: string = environment.apiClasModelUrl;

  constructor(private http: HttpClient) { }

  subirComentario(username: string,comentario: IClasModelCom[]){
    return this.http.post(this.baserUrl+'/subir/'+username,comentario);
  }

  ejecutarPrediccion(username: string){
    return this.http.get(this.baserUrl+'/predecir/'+ username);
  }

  getStast(username: string){
    return this.http.get<IClasStats>(this.baserUrl+ '/stats/'+ username);
  }
  
  buildStast(username: string,ids: string[],filtro:number[]){
    const obj = {
      "ids": ids,
      "filtro": filtro
    }
    return this.http.post(this.baserUrl+ '/stats/'+ username, obj);
  }

  getComentariosByUser(username: string){
    return this.http.get(this.baserUrl + '/comentarios/' + username);
  }

  getComentarioByUserById(username: string, comId: string){
    return this.http.get(this.baserUrl + '/comentarios/' + username + '/' + comId);
  }

  updateComentario(username: string,comentario: IClasModelCom[]){
    return this.http.put(this.baserUrl + '/comentarios/' + username , comentario);
  }
  
  deletedComentario(username: string,comId: string){
    return this.http.delete(this.baserUrl + '/delete/' + username + '/' + comId)
  }
  ///////
  gestionarData(username: string, filtrosPaginaGeneral: IFiltroPaginaGeneral){    
    return this.http.post(this.baserUrl + '/getionar/' + username, filtrosPaginaGeneral)
  }

  getComentariosGroupFechaFiltroIds(username: string,ids: string[]){
    const obj = {
      "comentarios_id": ids,
      "filtrarIds": true
    }
    return this.http.post(this.baserUrl + '/comentarios/group/' + username, obj)
  }
}
