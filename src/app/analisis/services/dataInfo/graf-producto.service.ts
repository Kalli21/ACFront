import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { WebapiService } from '../webapi/webapi.service';
import { IInfoFiltro } from '../../interfaces/webApi/Request/IInfoFiltro';
import { InfoGenerada, TipoInfo } from '../../interfaces/webApi/IInfoGenerada';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GrafProductoService {
  cargando = false;
  userName = localStorage.getItem('userName') || '';

  private infoCirculoSubject: BehaviorSubject<IClasStats> =
    new BehaviorSubject<IClasStats>({
      net: 0,
      pos: 0,
      neg: 0,
      total: 0,
    });

  private dataBarHorizontalSubject: BehaviorSubject<IBarInfo[]> = new BehaviorSubject<IBarInfo[]>([]);
  private dataWordCloudSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private dataComentariosSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private webapiService: WebapiService, private snackBar: MatSnackBar) {}

  infoCirculo$ = this.infoCirculoSubject.asObservable();
  dataBarHorizontal$ = this.dataBarHorizontalSubject.asObservable();
  dataWordCloud$ = this.dataWordCloudSubject.asObservable();
  dataComentarios$ = this.dataComentariosSubject.asObservable();


  ObtenerData(filtroInfo?: IInfoFiltro){
    this.userName = localStorage.getItem('userName') || '';
    if (this.userName !== '') {
      this.cargando = true;
      if (filtroInfo) {
        this.webapiService.generarInfo(this.userName, filtroInfo).subscribe((resp: any) =>{
          if (!resp.isSuccess) {
            this.showMessage(resp.displayMessage);
          }
          this.update_info()
          this.dataComentariosSubject.next(resp);                            
        });
      }else{
        this.update_info()
      }  
    }
  }

  limpiarData(){
    this.infoCirculoSubject.next({
      net: 0,
      pos: 0,
      neg: 0,
      total: 0,
    });
    this.dataBarHorizontalSubject.next([]);
    this.dataWordCloudSubject.next([]);
    this.dataComentariosSubject.next({});
  }
  
  private update_info(){
    this.userName = localStorage.getItem('userName') || '';
    this.webapiService.getInfo(this.userName, TipoInfo.Producto).subscribe({
      next: (info: InfoGenerada) => {
        this.infoCirculoSubject.next(info.producto_info.graf_circulo);
        this.dataBarHorizontalSubject.next(this.procesarDataHorizontal(info.producto_info.graf_bar_date));
        this.dataWordCloudSubject.next(info.producto_info.graf_word_cloud);
        this.cargando = false;
      }
    });
  }
  

  private procesarDataHorizontal(data: any[]): IBarInfo[] {
    let resp: IBarInfo[] = [];
    data.forEach((cat:any) => {
      const item = {
        "name": cat.nombre,
        "series": [
          {
            "name": "Negativo",
            "value": cat.neg
          },
          {
            "name": "Neutro",
            "value": cat.net
          },
          {
            "name": "Positivo",
            "value": cat.pos
          }
        ]
      }
      resp.push(item)
    });
    return resp;
  }

  showMessage(mng: string) {
    this.snackBar.open(mng, '', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['transparent-snackbar']
    });
  }
}
