import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IDataCSV } from '../../interfaces/predic_sentiment/IDataCSV';
import { CategoriaService } from '../../services/predict_sentiment/categoria.service';
import { ClienteService } from '../../services/predict_sentiment/cliente.service';
import { ComentarioService } from '../../services/predict_sentiment/comentario.service';
import { ProductoService } from '../../services/predict_sentiment/producto.service';
import { ICategoria } from '../../interfaces/predic_sentiment/ICategoria';
import { IProducto } from '../../interfaces/predic_sentiment/IProducto';
import { ICliente } from '../../interfaces/predic_sentiment/ICliente';
import { IComentario } from '../../interfaces/predic_sentiment/IComentario';
import { concatMap, map, retry, tap, toArray } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';
import { SentimentPredictService } from '../../services/clasModel/sentiment-predict.service';
import { IClasModelCom } from '../../interfaces/clasModel/IClasModel';
import { TopicModelingService } from '../../services/topicModel/topic-modeling.service';
import { ITopicModel } from '../../interfaces/topicModel/ITopicModel';


@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.css']
})
export class CargaDatosComponent implements OnInit {
  displayedColumns: string[] = ['id','contenido','fecha','productoId','clienteId']; // Aquí debes especificar las columnas de tu tabla
  dataSource: MatTableDataSource<any> | null = null;
  pageSizeOptions: number[] = [5, 10, 30 ];
  pageSize = 5;
  pageIndex = 0;
  length = 0;
  cantData = 0;
  cantDataPros = 0;
  cantDataTopic = 0;
  numTemas = 20;

  cargaParcial = false;
  analisisSentimento = false;
  analisisTemas = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isBackButtonDisabled = true;
  userName = localStorage.getItem('userName') || '';

  constructor(private dialog: MatDialog,
    private cartegoriaServices: CategoriaService,
    private clienteServices: ClienteService,
    private comentarioServices: ComentarioService,
    private productoServices: ProductoService,
    private modelPredicSetimentServices: SentimentPredictService,
    private topiModelingServices: TopicModelingService) { }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
    this.comentarioServices.getComentariosConPaginacion(this.userName,this.pageIndex + 1, this.pageSize).subscribe( (response: any) => {
      this.dataSource = new MatTableDataSource(response.result);
      this.dataSource.paginator = this.paginator;
      this.length = response.result.length + 1;
      if (this.dataSource) {
        this.cargaParcial = true;
      }
      // Actualizar otras propiedades si es necesario
    });
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.isBackButtonDisabled = this.pageIndex === 0;
    this.getData();
  }
  goToPreviousPage(): void {
    if (!this.isBackButtonDisabled) {
      this.pageIndex--; // Actualizar el índice de página
      this.isBackButtonDisabled = this.pageIndex === 0; // Deshabilitar el botón de retroceso si se encuentra en la primera página
      this.getData();
    }
  }
  openCsvModal(): void {
    const dialogRef = this.dialog.open(DataModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.guardarDatos(result);
      }
    });
  }



  guardarDatos(data: IDataCSV[]) {
    const userName = localStorage.getItem('userName');
    const objUser = localStorage.getItem('userInfo');
    let userid = 0;
    if (objUser) {
      const obj = JSON.parse(objUser);
      userid = obj.id;
    }
    this.cargaParcial = false;
    if (userName) {
      this.cantData = data.length;
      of(...data).pipe(
        concatMap((e: IDataCSV) => {
          return this.crearCategoria(e, userName).pipe(
            concatMap((datcategoria: ICategoria) => {
              return this.crearProducto(e, userid).pipe(
                concatMap((datproducto: IProducto) => {
                  const prod = datproducto;
                  return this.actualizarProducto(prod, datcategoria).pipe(
                    concatMap(() => {
                      return this.crearCliente(e, userName).pipe(
                        concatMap((datcliente: ICliente) => {
                          const cli = datcliente;
                          return this.crearComentario(e, userName, datcliente, datproducto).pipe(
                            map((com: IComentario) => {
                              this.subirComentarioModelPredict(userName, com);
                              return { categoria: datcategoria, producto: prod, cliente: cli, comentario: com };
                            })
                          );
                        })
                      );
                    })
                  );
                })
              );
            })
          );
        }),
        toArray(),
        tap((resultados: any[]) => {
          // console.log('Operaciones completadas:', resultados);
        })
      ).subscribe(() => {
        // console.log('Todas las operaciones han sido completadas.');
      });
    }
  }

  crearCategoria(e: IDataCSV, userName: string): Observable<ICategoria> {
    const cat: ICategoria = {
      id: 0,
      nombre: e.NombreCategoria || '',
      productos: [],
      userName: userName || ''
    };

    return this.cartegoriaServices.crearCategoria(cat).pipe(
      map((data: any) => {
        return data.result;
      })
    );
  }

  crearProducto(e: IDataCSV, userid: number): Observable<IProducto> {
    const prod: IProducto = {
      id: 0,
      codProducto: e.CodProducto || '',
      nombre: e.NombreProducto || '',
      descripcion: e.DescripcionProducto || '',
      precio: Number(e.PrecioProducto),
      urlImg: e.Imagen || '',
      usuarioId: userid,
      categorias: [],
      comentarios: []
    };

    return this.productoServices.crearProducto(prod).pipe(
      map((data: any) => {
        return data.result;
      })
    );
  }

  actualizarProducto(producto: IProducto, categoria: ICategoria): Observable<void> {
    if (producto.categorias.some(p => p.nombre === categoria.nombre)) {
      producto.categorias = [];
    } else {
      producto.categorias = [];
      producto.categorias.push(categoria);
    }
    return this.productoServices.actualizarProducto(producto.id, producto).pipe(
      map(() => { })
    );
  }

  crearCliente(e: IDataCSV, userName: string): Observable<ICliente> {
    const cli: ICliente = {
      id: 0,
      nombre: e.NombreCliente || '',
      codCliente: e.CodCliente || '',
      comentarios: [],
      userName: userName
    };

    return this.clienteServices.crearCliente(cli).pipe(
      map((data: any) => {
        return data.result;
      })
    );
  }

  crearComentario(e: IDataCSV, userName: string, cli: ICliente, prod: IProducto): Observable<IComentario> {
    const ff = e.Fecha;
    const com: IComentario = {
      id: 0,
      contenido: e.Comentario || '',
      fecha: this.trans_date(ff || ''),
      productoId: prod.id,
      clienteId: cli.id || 0,
      userName: userName
    };
    return this.comentarioServices.crearComentario(com).pipe(
      map((data: any) => {
        return data.result;
      })
    );
  }


  private trans_date(fechaString: string) {
    if (fechaString !== '') {
      const partesFecha: string[] = fechaString.split("/");
      const fecha: Date = new Date(Number(partesFecha[2]), Number(partesFecha[1]) - 1, Number(partesFecha[0]));
      return fecha.toISOString();
    }
    return undefined;

  }

  subirComentarioModelPredict(userName: string, com: IComentario) {
    const predicCom: IClasModelCom = {
      id: com.id.toString(),
      text: com.contenido,
      probabilidades: [],
      categoria: -1,
      fecha: com.fecha || ''
    }

    this.modelPredicSetimentServices.subirComentario(userName, [predicCom])
    .pipe(retry(3)) // Intentar 10 veces en caso de error
    .subscribe(() => {
      this.cantDataPros += 1;
    });
    
    const topiCom: ITopicModel = {
      id: com.id.toString(),
      text: com.contenido,
      temas: {},
      fecha: com.fecha || ''
    }

    this.topiModelingServices.subirComentario(userName, [topiCom])
    .pipe(retry(3)) // Intentar 10 veces en caso de error
    .subscribe(() => {
      this.cantDataTopic += 1;
    });

    // Aquí agregamos el código para realizar acciones después de todas las inserciones
    const inserciones = []; // Array para almacenar todas las observables de las inserciones

    // Agregar más llamadas a this.modelPredicSetimentServices.subirComentario si es necesario
    inserciones.push(this.modelPredicSetimentServices.subirComentario(userName, [predicCom]));
    inserciones.push(this.topiModelingServices.subirComentario(userName, [topiCom]));
                                               

    forkJoin(inserciones).subscribe(results => {

      if( this.cantData*0.9 <= this.cantDataPros && this.cantData*0.9 <= this.cantDataTopic ){
        this.getData();   
        this.cargaParcial = true;
      }
        
    });

  }
  
  ejecutarAnalisis(){
    this.analisisSentimento = true;
    this.analisisTemas = true;
    this.modelPredicSetimentServices.ejecutarPrediccion(this.userName)
    .pipe(retry(3))
    .subscribe( d => {
      this.analisisSentimento = false;
     });
    this.topiModelingServices.ejecutarTopicModeling(this.userName,this.numTemas)
    .pipe(retry(3))
    .subscribe( d => { 
      this.analisisTemas = false;
    });
    
  
  }

}
