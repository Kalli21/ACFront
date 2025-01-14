import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  baserUrl: string = environment.webApiUrl + '/Categoria/';

  constructor(private http: HttpClient) { }

  getCategorias(username:string) {
    return this.http.get(this.baserUrl + 'username/' + username);
  }

}
