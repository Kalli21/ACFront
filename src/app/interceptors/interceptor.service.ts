import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const auth_token = localStorage.getItem('token_value');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'bearer ' + auth_token
    });

    const reqClone = req.clone({headers});

    return next.handle(reqClone).pipe(
      catchError(this.manejarError)
    );
  
  }

  manejarError(error:HttpErrorResponse){
    console.log('sucedio un error');
    console.log(error);
    return throwError(()=>new Error('Error personalizado'));
  }
}
