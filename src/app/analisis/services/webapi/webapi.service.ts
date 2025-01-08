import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IInfoFiltro } from '../../interfaces/webApi/Request/IInfoFiltro'
import { Observable } from 'rxjs';
import { InfoGenerada } from '../../interfaces/webApi/IInfoGenerada';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {

  baserUrl: string = environment.webApiUrl;

  constructor(private http: HttpClient) { }

  subirArchivo(username:string , sep: string, fin_linea: string = '\n', file: File) {
    let url = this.baserUrl + '/upload/' + username + '?sep=' + sep;
    if (fin_linea != '\n' ) {
      url += '&fin_linea=' + fin_linea
    }    
    const formData: FormData = new FormData();
    formData.append('file', file); // 'file' debe coincidir con el nombre en la API
    return this.http.post(url, formData);
  }

  procesarArchivo(username:string , id_arch: number, clean_data_user: boolean = false ) {
    let url = this.baserUrl + '/ProcesarArchivo/'+ username + '?id_arch=' + id_arch;
    if (clean_data_user) {
      url += '&clean_data_user=true'
    }
    return this.http.post(url, null);
  }

  ejecutarAnalisis(username:string , num_temas: number, predic_all: boolean = false ) {
    let url = this.baserUrl + '/EjecutarAnalisis/'+ username + '?num_temas=' + num_temas;
    if (predic_all) {
      url += '&predic_all=true'
    }
    return this.http.post(url, null);
  }

  generarInfo(username:string, filtros: IInfoFiltro) {
    let url = this.baserUrl + '/GenerarInfo/' + username;
    return this.http.post(url, filtros);
  }
  
  getInfo(username:string, tipo: string = 'all'): Observable<InfoGenerada>  {
    let url = this.baserUrl + '/info/' + username + '?tipo_info=' + tipo;
    return this.http.get<InfoGenerada>(url);
  }

  getComentarios(username:string, filtros: IInfoFiltro){
    let url = this.baserUrl + '/GetComentarios/' + username;
    return this.http.post(url, filtros);
  }
}
