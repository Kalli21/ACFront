import { Injectable } from '@angular/core';
import { SentimentPredictService } from '../clasModel/sentiment-predict.service';
import { ComentarioService } from '../predict_sentiment/comentario.service';
import { TopicModelingService } from '../topicModel/topic-modeling.service';
import { IComentariosFiltros } from '../../interfaces/predic_sentiment/Request/IComentariosFiltros';
import { IComentario } from '../../interfaces/predic_sentiment/IComentario';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { CategoriaService } from '../predict_sentiment/categoria.service';

@Injectable({
  providedIn: 'root'
})
export class GrafGeneralService {

  cargando = false;

  infoCirculo: IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };
  
  infoMapTreeTopPos:any = []
  
  infoBarHorizontal:any = []
  
  infoBarFechaCom:any = []

  infoWordCloud:any = []

  userName = localStorage.getItem('userName') || '';
  
  constructor(private sentimentPredictService: SentimentPredictService,
    private comentarioService: ComentarioService,
    private categoriaService: CategoriaService,    
    private topicModelingService: TopicModelingService) {
    
    this.obtenerDataCirculoIni();
    this.obtenerDataMapTree_BarCategoria();
    this.obtenerDataBarFecha();
    this.obtenerWordCloud();
  
  }
  
  obtenerDataCirculoIni() {
    this.sentimentPredictService.getStast(this.userName).subscribe((d: IClasStats) => {
      this.infoCirculo = d;
    });
    
  }

  obtenerDataCirculo(filtro: IComentariosFiltros,filtroSentimiento: number[]) {

    if (this.userName !== '') {
      this.cargando = true;
      this.comentarioService.getComentariosConFiltros(this.userName, filtro).subscribe((coments: any) => {
        let listaIDs = coments.result.map((objeto: IComentario) => objeto.id.toString());
        this.sentimentPredictService.buildStast(this.userName, listaIDs,filtroSentimiento).subscribe((rep: any) => {
          this.infoCirculo = rep.infoCirculo
          this.cargando = false;
        });
      })
    }

  }

  obtenerDataMapTree_BarCategoria(){
    if (this.userName !== '') {
      this.cargando = true;
      this.categoriaService.getCategoriasConComentarios(this.userName).subscribe( (categorias:any) => {
        this.sentimentPredictService.gestionarData(this.userName,categorias.result).subscribe( (res:any) => {
          
          this.infoBarHorizontal = res.infoCategoria;
          this.infoMapTreeTopPos = res.infoTopPos;

        })
      });
    }
    
  }

  obtenerDataBarFecha(){
    if (this.userName !== ''){
      this.sentimentPredictService.getComentariosGroupFechaFiltroIds(this.userName,[]).subscribe( (comGroup:any) =>{
        this.infoBarFechaCom = comGroup;
      } );
    }
  }

  obtenerWordCloud(){
    if (this.userName !== ''){
      this.topicModelingService.getTemas(this.userName,4).subscribe( (words:any) =>{
        this.infoWordCloud = words;
      });
    }
  }

}
