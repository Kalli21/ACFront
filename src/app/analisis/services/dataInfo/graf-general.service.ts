import { Injectable } from '@angular/core';
import { SentimentPredictService } from '../clasModel/sentiment-predict.service';
import { ComentarioService } from '../predict_sentiment/comentario.service';
import { TopicModelingService } from '../topicModel/topic-modeling.service';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { CategoriaService } from '../predict_sentiment/categoria.service';
import { BehaviorSubject } from 'rxjs';
import { ICategoriasFiltros } from '../../interfaces/predic_sentiment/Request/ICategoriasFiltros';
import { IFiltroPaginaGeneral } from '../../interfaces/clasModel/request/IFiltroPaginaGeneral';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';

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
  private dataWordCloudSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  private dataBarVerticalSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  private dataMapTreeTopSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);

  constructor(
    private sentimentPredictService: SentimentPredictService,
    private comentarioService: ComentarioService,
    private categoriaService: CategoriaService,
    private topicModelingService: TopicModelingService
  ) {}

  infoCirculo$ = this.infoCirculoSubject.asObservable();
  dataBarHorizontal$ = this.dataBarHorizontalSubject.asObservable();
  dataWordCloud$ = this.dataWordCloudSubject.asObservable();
  dataBarVertical$ = this.dataBarVerticalSubject.asObservable();
  dataMapTreeTop$ = this.dataMapTreeTopSubject.asObservable();

  ObtenerData(
    filtrosCategoria: ICategoriasFiltros,
    filtroSentimiento: number[]
  ) {
    if (this.userName !== '') {
      this.cargando = true;
      this.categoriaService
        .getCategoriasConComentariosConFiltros(this.userName, filtrosCategoria)
        .subscribe((categorias: any) => {
          const filtros: IFiltroPaginaGeneral = {
            categorias: categorias.result,
            filtrosSentimiento: filtroSentimiento,
          };
          this.sentimentPredictService
            .gestionarData(this.userName, filtros)
            .subscribe((res: any) => {
              this.infoCirculoSubject.next(res.stastGeneral);
              this.dataMapTreeTopSubject.next(res.infoTopPos);
              this.dataBarHorizontalSubject.next(res.infoCategoria);
              this.topicModelingService
                .getTemasByComentarios(this.userName, res.comentariosIds, 4, [])
                .subscribe((respTopic: any) => {
                  this.dataWordCloudSubject.next(respTopic.temas);

                  this.obtenerDataBarFecha(respTopic.comentariosId);

                  this.cargando = false;
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
          this.dataBarVerticalSubject.next(resulList);
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
          let categoriaCount = months[month][months[month].length - 1][0][1];

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
