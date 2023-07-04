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

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private grafProductoService: GrafProductoService,
    private grafGeneralService: GrafGeneralService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + auth_token,
    });

    const reqClone = req.clone({ headers });

    return next.handle(reqClone).pipe(catchError(this.manejarError));
  }

  manejarError = (error: HttpErrorResponse) => {
    // if (this.grafGeneralService && this.grafGeneralService.cargando) {
    //   this.grafGeneralService.cargando = false;
    // }
    // if (this.grafProductoService && this.grafProductoService.cargando) {
    //   this.grafProductoService.cargando = false;
    // }

    console.log('sucedio un error');
    console.log(error);
    if (error.error && error.error.displayMessage === 'Usuario no existe') {
      // Mostrar alerta en pantalla con el mensaje de error
      alert(error.error.displayMessage);
    }
    return throwError(() => new Error('Error personalizado'));
  };
}
