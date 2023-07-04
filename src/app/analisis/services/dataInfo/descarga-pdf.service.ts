import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescargaPDFService {

  private downloadGeneralSubject = new Subject<void>();
  private downloadProductoSubject = new Subject<void>();

  downloadGeneralView$ = this.downloadGeneralSubject.asObservable();
  downloadProductoView$ = this.downloadProductoSubject.asObservable();

  requestDownloadGeneral() {
    this.downloadGeneralSubject.next();
  }

  requestDownloadproducto() {
    this.downloadProductoSubject.next();
  }
}
