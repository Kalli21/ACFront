import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITopicModel } from '../../interfaces/topicModel/ITopicModel';

@Injectable({
  providedIn: 'root'
})
export class TopicModelingService {

  baserUrl: string = environment.apiTopicModelUrl;

  constructor(private http: HttpClient) { }

  subirComentario(username: string,comentario: ITopicModel[]){
    return this.http.post(this.baserUrl+'/subir/'+username,comentario);
  }

  ejecutarTopicModeling(username: string, numTemas: number){
    return this.http.get(this.baserUrl+'/detTemas/'+ username + '/' + numTemas);
  }
  
  getTemas(username: string, numWord: number){

    return this.http.get(this.baserUrl + '/temas/' + username + '/' + numWord);
  }
  
  getCantTemas(username: string){
    return this.http.get(this.baserUrl + '/canttemas/' + username);
  }

  getStat(username: string){
    return this.http.get(this.baserUrl + '/stats/' + username);
  }

  getComentariosByUser(username: string){
    return this.http.get(this.baserUrl + '/comentarios/' + username);
  }

  getComentarioByUserById(username: string, senteceId : string){
    return this.http.get(this.baserUrl + '/comentarios/' + username + '/' + senteceId)
  }
  
  updateComentario(username: string,comentario: ITopicModel[]){
    return this.http.put(this.baserUrl + '/comentarios/' + username , comentario);
  }
  
  deletedComentario(username: string,senteceId: string){
    return this.http.delete(this.baserUrl + '/delete/' + username + '/' + senteceId)
  }

  getTemasByComentarios(username: string,ids: string[],numWord: number,filtro:number[]){
    const obj = {
      "ids": ids,
      "filtro":filtro
    }
    return this.http.post(this.baserUrl + '/temas/comentarios/' + username + '/' +numWord,obj)
    
  }
}
