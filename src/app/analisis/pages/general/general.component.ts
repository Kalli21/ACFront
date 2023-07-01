import { Component, OnInit } from '@angular/core';
import { GrafGeneralService } from '../../services/dataInfo/graf-general.service';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { ICategoria } from '../../interfaces/predic_sentiment/ICategoria';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {

  userName=''
  infoCirculo : IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };
  
  tituloBarVertical = "Setimiento por Mes";
  dataBarVertical: IBarInfo[] = [];
  
  tituloBarHorizontal = "Setimiento por Categoria";
  dataBarHorizontal: IBarInfo[] = [];

  dataTreeMap: any = []
  dataWordCloud: any = []

  constructor(private grafGeneralService:GrafGeneralService) {
  }


  ngOnInit() {
    this.grafGeneralService.infoCirculo$.subscribe((data: IClasStats) => {
      this.infoCirculo = data;
    });
    this.grafGeneralService.dataMapTreeTop$.subscribe((data: any[] ) => {      
      this.dataTreeMap = data;
    });
    this.grafGeneralService.dataBarHorizontal$.subscribe((data: any[] ) => {
      this.dataBarHorizontal = procesarDataHorizontal(data);
       
    });
    this.grafGeneralService.dataWordCloud$.subscribe((data: any[] ) => {
      this.dataWordCloud = data;
    });
    this.grafGeneralService.dataBarVertical$.subscribe((data: IBarInfo[] ) => {
      this.dataBarVertical = data;
    });
    
  }

}
function procesarDataHorizontal(data: ICategoria[]): IBarInfo[] {
  let resp: IBarInfo[] = [];
  data.forEach((cat:any) => {
    const item = {
      "name": cat.nombre,
      "series": [
        {
          "name": "Negativo",
          "value": cat.stats.neg
        },
        {
          "name": "Neutro",
          "value": cat.stats.net
        },
        {
          "name": "Positivo",
          "value": cat.stats.pos
        }
      ]
    }
    resp.push(item)
  });
  return resp;
}

