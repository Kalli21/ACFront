import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IUsuario } from '../../interfaces/IUsuario';
import { GrafGeneralService } from 'src/app/analisis/services/dataInfo/graf-general.service';
import { GrafProductoService } from '../../../analisis/services/dataInfo/graf-producto.service';
import { BehaviorSubject } from 'rxjs';
import { InfoGenerada, TipoInfo } from '../../../analisis/interfaces/webApi/IInfoGenerada';
import { WebapiService } from 'src/app/analisis/services/webapi/webapi.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private isLoggedIn = false;

  baserUrl: string = environment.webApiUrl + '/Usuario/';
  private msgEstadoSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  msgEstado$ = this.msgEstadoSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, 
    private grafGeneralService: GrafGeneralService,
    private grafProductoService: GrafProductoService,
    private webapiService: WebapiService) {}
    
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
    this.limpiarData();
    this.isLoggedIn = false;
    this.router.navigate(['/auth']);
    // window.location.reload();
       
  }
  
  limpiarData(){
    localStorage.removeItem('userName');
    localStorage.removeItem('token_value');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('filtrosGeneral');
    localStorage.removeItem('filtrosProducto');
    localStorage.removeItem('isCollapsed');
    localStorage.removeItem('recordarme');
    localStorage.removeItem('primerInicio');
    this.grafGeneralService.limpiarData();
    this.grafProductoService.limpiarData();
  }

  get getUsername() {
    return localStorage.getItem('userName');
  }

  get isAutenticado() {
    return !!localStorage.getItem('token_value');
  }

  isAuthenticated(): boolean {
    let local_recordar = localStorage.getItem('recordarme') === 'true';
    if (local_recordar) { 
      this.isLoggedIn = true;
    }
    return this.isLoggedIn;
  }  

  getEstado(info?: InfoGenerada) {
    let userName = localStorage.getItem('userName') || '';
    if(info){
      this.procesarEstado(info);
    }else{
      this.webapiService.getInfo(userName, TipoInfo.Estados).subscribe({
        next: (resp: InfoGenerada) => {
          this.procesarEstado(resp);
        }
      });
    }
  }

  clearEstado() {
    this.msgEstadoSubject.next('');
  }

  private procesarEstado(info: InfoGenerada){
    let msg = "";
    if(info.stats_ps.estado === 2){
      msg = "Cargando Comentarios";
    }
    if(info.stats_ct.estado === 1){
      msg = "Analisando Comentarios";
    }
    if(info.stats_ct.estado === 3){
      msg = "Obteniendo Información";
    }
    this.msgEstadoSubject.next(msg);
  }

  isAuthorized() {
    return this.http.get(this.baserUrl + 'Autorizacion');
  }
  
}
