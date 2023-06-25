import { Component, OnInit } from '@angular/core';
import { GrafGeneralService } from '../../services/dataInfo/graf-general.service';
import { IComentariosFiltros } from '../../interfaces/predic_sentiment/Request/IComentariosFiltros';
import { SentimentPredictService } from '../../services/clasModel/sentiment-predict.service';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {

  userName=''
  data : IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };

  dataCategoria: any = []
  dataTreeMap: any = []
  dataBarFecha: any = []
  dataWordCloud: any = []

  constructor(private grafGeneralService:GrafGeneralService,
    private sentimentPredictService:SentimentPredictService) {


  }
  ngOnInit() {
    const filtro :IComentariosFiltros = {

    }
      
    this.data =  this.grafGeneralService.infoCirculo;
    this.dataCategoria = this.grafGeneralService.infoBarHorizontal;
    this.dataTreeMap = this.grafGeneralService.infoMapTreeTopPos;
    this.dataBarFecha=this.grafGeneralService.infoBarFechaCom;
    this.dataWordCloud = this.grafGeneralService.infoWordCloud;
  }

}
