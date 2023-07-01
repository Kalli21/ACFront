import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { SentimentPredictService } from '../clasModel/sentiment-predict.service';
import { IComentario } from '../../interfaces/predic_sentiment/IComentario';
import { IComentariosFiltros } from '../../interfaces/predic_sentiment/Request/IComentariosFiltros';
import { ComentarioService } from '../predict_sentiment/comentario.service';
import { TopicModelingService } from '../topicModel/topic-modeling.service';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';

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

  private dataBarHorizontalSubject: BehaviorSubject<IBarInfo[]> =
    new BehaviorSubject<IBarInfo[]>([]);
  private dataWordCloudSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  private dataComentariosSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);

  constructor(
    private sentimentPredictService: SentimentPredictService,
    private comentarioService: ComentarioService,
    private topicModelingService: TopicModelingService
  ) {}

  infoCirculo$ = this.infoCirculoSubject.asObservable();
  dataBarHorizontal$ = this.dataBarHorizontalSubject.asObservable();
  dataWordCloud$ = this.dataWordCloudSubject.asObservable();
  dataComentarios$ = this.dataComentariosSubject.asObservable();

  // Resto del código del servicio...
  obtenerData(
    filtro: IComentariosFiltros,
    filtroTema: number[],
    filtroSentimiento: number[]
  ) {
    if (this.userName !== '') {
      this.cargando = true;

      this.comentarioService
        .getComentariosConFiltros(this.userName, filtro)
        .subscribe((coments: any) => {
          let listaIDs = coments.result.map((objeto: IComentario) =>
            objeto.id.toString()
          );
          
          this.topicModelingService
            .getTemasByComentarios(this.userName, listaIDs, 4, filtroTema)
            .subscribe((respTopic: any) => {
              this.dataWordCloudSubject.next(respTopic.temas);

              this.sentimentPredictService
                .buildStast(
                  this.userName,
                  respTopic.comentariosId,
                  filtroSentimiento
                )
                .subscribe((respModelIA: any) => {
                  this.infoCirculoSubject.next(respModelIA.infoCirculo);
                  this.dataComentariosSubject.next(respModelIA.comentarios);

                  const comnetsIds = respModelIA.comentarios.map(
                    (objeto: any) => objeto.id
                  );
                  console.log("IDS PRIMER FILTRO 'filtroSentimiento': ", comnetsIds)
                  this.obtenerDataBarFecha(comnetsIds);
                });
            });
        });
    }
  }

  private obtenerDataBarFecha(comnetsIds: string[]) {
    if (this.userName !== '') {
      this.sentimentPredictService
        .getComentariosGroupFechaFiltroIds(this.userName, comnetsIds)
        .subscribe((comGroup: any) => {
          const resulList: IBarInfo[] =
            this.iterateDataComentariosFecha(comGroup);
          this.dataBarHorizontalSubject.next(resulList);
          this.cargando = false;
        });
    }
  }
  private iterateDataComentariosFecha(data: any) {
    const resulList: IBarInfo[] = [];
    for (let year in data) {
      let months = data[year];
      for (let month in months) {
        if (
          months[month]
        ) {
          // let categoriaCount = months[month][1][0][1];
          let categoriaCount = months[month][months[month].length - 1][0][1];
          // Resto del código...
          ////
          const item = {
            name: year + ' - ' + month,
            series: [
              {
                name: 'Negativo',
                value: categoriaCount[0],
              },
              {
                name: 'Neutro',
                value: categoriaCount[1],
              },
              {
                name: 'Positivo',
                value: categoriaCount[2],
              },
            ],
          };
          resulList.push(item);
        } else {
          console.log(
            'Estructura de datos incorrecta en el objeto:',
            data[year][month]
          );
        }
      }
    }

    return resulList;
  }
}
