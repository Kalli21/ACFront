import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../../interfaces/IUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  baserUrl: string = environment.apiUrl + '/api/Usuario/';

  constructor(private http: HttpClient,
              private router: Router) { }

  register(user: IUsuario){
      return this.http.post(this.baserUrl+'Register', user);
  }

  login(user: IUsuario){
      return this.http.post(this.baserUrl+'Login', user);
  }

  logout(){
    localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    // this.router.navigate(['/clientes']);
    window.location.reload();
  }

  get getUsername(){
    return localStorage.getItem('userName');
  }

  get isAutenticado(){
    return !!localStorage.getItem('token_value');
  }

  getUsuarios() {

    return this.http.get(this.baserUrl);
  }

  getUsuario(id: number) {

    return this.http.get(this.baserUrl + id);
  }

  actualizarUsuario(id: number, usuario: IUsuario) {

    return this.http.put(this.baserUrl + id, usuario);
  }

  deleteUsuario(id: number) {

    return this.http.delete(this.baserUrl + id);
  }
}
