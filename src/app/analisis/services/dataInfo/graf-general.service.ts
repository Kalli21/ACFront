import { Injectable } from '@angular/core';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { BehaviorSubject } from 'rxjs';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { WebapiService } from '../webapi/webapi.service';
import { IInfoFiltro } from '../../interfaces/webApi/Request/IInfoFiltro';
import { InfoGenerada, TipoInfo } from '../../interfaces/webApi/IInfoGenerada';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class GrafGeneralService {
  cargando = false;
  userName = localStorage.getItem('userName') || '';

  private infoCirculoSubject: BehaviorSubject<IClasStats> =
    new BehaviorSubject<IClasStats>({
      net: 0,
      pos: 0,
      neg: 0,
      total: 0,
    });
  private dataBarHorizontalSubject: BehaviorSubject<IBarInfo[]> =
    new BehaviorSubject<IBarInfo[]>([]);
  private dataWordCloudSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private dataBarVerticalSubject: BehaviorSubject<IBarInfo[]> = new BehaviorSubject<IBarInfo[]>([]);
  private dataMapTreeTopPosSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private dataMapTreeTopNegSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private webapiService: WebapiService, private snackBar: MatSnackBar) {    
  }

  infoCirculo$ = this.infoCirculoSubject.asObservable();
  dataBarHorizontal$ = this.dataBarHorizontalSubject.asObservable();
  dataWordCloud$ = this.dataWordCloudSubject.asObservable();
  dataBarVertical$ = this.dataBarVerticalSubject.asObservable();
  dataMapTreeTopPos$ = this.dataMapTreeTopPosSubject.asObservable();
  dataMapTreeTopNeg$ = this.dataMapTreeTopNegSubject.asObservable();

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
        });
      }else{
        this.update_info()
      }  
    }
  }
  
  private update_info(){
    this.userName = localStorage.getItem('userName') || '';
    this.webapiService.getInfo(this.userName, TipoInfo.General).subscribe({
      next: (info: InfoGenerada) => {
        this.infoCirculoSubject.next(info.general_info.graf_circulo);
        this.dataMapTreeTopPosSubject.next(info.general_info.graf_rank_pos);
        this.dataMapTreeTopNegSubject.next(info.general_info.graf_rank_neg);
        this.dataBarHorizontalSubject.next(this.procesarDataHorizontal(info.general_info.graf_bar_cat));
        this.dataWordCloudSubject.next(info.general_info.graf_word_cloud);
        this.dataBarVerticalSubject.next(this.procesarDataHorizontal(info.general_info.graf_bar_date));
        this.cargando = false;
      }
    });
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
    this.dataBarVerticalSubject.next([]);
    this.dataMapTreeTopPosSubject.next([]);
    this.dataMapTreeTopNegSubject.next([]);
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
