import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../../interfaces/IUsuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private isLoggedIn = false;

  baserUrl: string = environment.apiBackUrl + '/api/Usuario/';

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true; // El usuario está autenticado, permite el acceso a la ruta
    } else {
      this.router.navigate(['/login']); // Redirecciona a la página de inicio de sesión si el usuario no está autenticado
      return false; // Bloquea el acceso a la ruta
    }
  }

  register(user: IUsuario) {
    this.isLoggedIn = true;
    return this.http.post(this.baserUrl + 'Register', user);
  }

  login(user: IUsuario) {
    this.isLoggedIn = true;
    return this.http.post(this.baserUrl + 'Login', user);
  }

  logout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('filtrosGeneral');
    localStorage.removeItem('filtrosProducto');
    this.router.navigate(['/analisis']);
    window.location.reload();
    this.isLoggedIn = false;
  }

  get getUsername() {
    return localStorage.getItem('userName');
  }

  get isAutenticado() {
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

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
