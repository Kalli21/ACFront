import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { IDataCSV } from '../../interfaces/IDataCSV';
import { CategoriaService } from '../../services/predict_sentiment/categoria.service';
import { ClienteService } from '../../services/predict_sentiment/cliente.service';
import { ComentarioService } from '../../services/predict_sentiment/comentario.service';
import { ProductoService } from '../../services/predict_sentiment/producto.service';
import { ICategoria } from '../../interfaces/ICategoria';
import { IProducto } from '../../interfaces/IProducto';
import { ICliente } from '../../interfaces/ICliente';
import { IComentario } from '../../interfaces/IComentario';
import { concatMap, map, tap, toArray } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.css']
})
export class CargaDatosComponent {
  displayedColumns: string[] = []; // Aquí debes especificar las columnas de tu tabla
  dataSource: MatTableDataSource<any> | null = null;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageSize = 5;
  pageIndex = 0;
  length = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog,
    private cartegoriaServices: CategoriaService,
    private clienteServices: ClienteService,
    private comentarioServices: ComentarioService,
    private productoServices: ProductoService) { }

  openCsvModal(): void {
    const dialogRef = this.dialog.open(DataModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.dataSource = new MatTableDataSource(result); // Asigna los datos al dataSource
        this.displayedColumns = Object.keys(result[0]); // Asigna las columnas
        this.length = result.length; // Actualiza la longitud total de los datos
        this.dataSource.paginator = this.paginator; // Asigna el paginador al dataSource
        this.guardarDatos(result);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  guardarDatos(data: IDataCSV[]) {
    const userName = localStorage.getItem('userName');
    const objUser = localStorage.getItem('userInfo');
    let userid = 0;
    if (objUser) {
      const obj = JSON.parse(objUser);
      userid = obj.id;
    }

    if (userName) {
      of(...data).pipe(
        concatMap((e: IDataCSV) => {
          return this.crearCategoria(e, userName).pipe(
            concatMap((datcategoria: ICategoria) => {
              return this.crearProducto(e, userid).pipe(
                concatMap((datproducto: IProducto	) => {
                  const prod = datproducto;
                  return this.actualizarProducto(prod,datcategoria).pipe(
                    concatMap(() => {
                      return this.crearCliente(e, userName).pipe(
                        concatMap((datcliente: ICliente) => {
                          const cli = datcliente;
                          return this.crearComentario(e,userName,datcliente,datproducto).pipe(
                            map((com:IComentario) => {                              
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
          console.log('Operaciones completadas:', resultados);
        })
      ).subscribe(() => {
        console.log('Todas las operaciones han sido completadas.');
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
      urlImg: '',
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

  actualizarProducto(producto: IProducto,categoria: ICategoria): Observable<void> {
    if (producto.categorias.some( p=> p.nombre === categoria.nombre)){
      producto.categorias = [];
    }else{
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

  crearComentario(e:IDataCSV,userName: string, cli: ICliente,prod:IProducto): Observable<IComentario> {
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
      map((data:any) => { 
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

}
