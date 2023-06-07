import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IClasModelCom } from '../../interfaces/clasModel/IClasModel';

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
    return this.http.get(this.baserUrl+ '/stats/'+ username);
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
}
