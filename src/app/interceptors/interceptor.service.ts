import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { GrafProductoService } from '../analisis/services/dataInfo/graf-producto.service';
import { GrafGeneralService } from '../analisis/services/dataInfo/graf-general.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../auth/services/predict_sentiment/usuario.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private grafProductoService: GrafProductoService,
    private grafGeneralService: GrafGeneralService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const auth_token = localStorage.getItem('token_value');
    const user = localStorage.getItem('userName');
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: 'bearer ' + auth_token,
    });    
    // Si no es un FormData (no estamos enviando un archivo), entonces añadimos 'Content-Type: application/json'
    if (!(req.body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const reqClone = req.clone({ headers });

    return next.handle(reqClone).pipe(catchError(this.manejarError));
  }

  manejarError = (error: HttpErrorResponse) => { 
    
    if (error.status === 401) {
      this.usuarioService.logout();
    }
    
    if (this.grafGeneralService && this.grafGeneralService.cargando) {
      this.grafGeneralService.cargando = false;
    }
    if (this.grafProductoService && this.grafProductoService.cargando) {
      this.grafProductoService.cargando = false;
    }  
    console.log('sucedio un error');
    console.log(error);
    if (error.error && error.error.detail ) {
      const detalle = error.error.detail;
      if (typeof detalle === 'string' && detalle.includes("Unauthorized")) {
        this.usuarioService.logout();
      }
      if (typeof detalle === 'object' && detalle.displayMessage && detalle.displayMessage !== '') {
        this.showMessage(detalle.displayMessage);
      }
      if (error.error.detail.displayMessage && error.error.detail.displayMessage !== '') {
        // Mostrar alerta en pantalla con el mensaje de error
        this.showMessage(error.error.detail.displayMessage);
      }
      
    }else{
      this.showMessage('Sucedio un error.');
    }
    return throwError(() => new Error('Error personalizado'));
  };

  showMessage(mng: string) {
    this.snackBar.open(mng, '', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['transparent-snackbar']
    });
  }

}
