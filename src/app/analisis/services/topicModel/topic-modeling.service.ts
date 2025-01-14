import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ITopicModel } from '../../interfaces/topicModel/ITopicModel';

@Injectable({
  providedIn: 'root'
})
export class TopicModelingService {

  baserUrl: string = environment.webApiUrl;

  constructor(private http: HttpClient) { }

  getTemas(username: string, numWord: number){
    return this.http.get(this.baserUrl + '/temas/' + username + '/' + numWord);
  }
  
}
