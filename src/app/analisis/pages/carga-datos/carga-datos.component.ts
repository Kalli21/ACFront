import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { WebapiService } from '../../services/webapi/webapi.service';
import { InfoGenerada } from '../../interfaces/webApi/IInfoGenerada';
import { TipoInfo } from '../../interfaces/webApi/IInfoGenerada';
import { IInfoFiltro } from '../../interfaces/webApi/Request/IInfoFiltro'
import { UsuarioService } from '../../../auth/services/predict_sentiment/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.css']
})
export class CargaDatosComponent implements OnInit {
  displayedColumns: string[] = ['correlativo','contenido','fecha','producto','cliente','sentimiento','probabilidad']; // Aquí debes especificar las columnas de tu tabla
  dataSource: MatTableDataSource<any> | null = null;
  pageSizeOptions: number[] = [5, 10, 30 ];
  pageSize = 5;
  pageIndex = 0;
  length = 0;
  cantData = 0;
  cantDataPros = 0;
  cantDataTopic = 0;
  numTemas = 20;
  
  subiendoDatos = false;
  cargaParcial = false;
  
  analisisDisponible = true;
  predic_all = false;  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isBackButtonDisabled = true;
  userName = localStorage.getItem('userName') || '';  

  filtroInfo: IInfoFiltro = {
    CT_filtro_com : {
      categoriasId: [],
      listId: []
    },      
    PS_filtros_com : {
      pageNumber: this.pageIndex + 1,
      pageSize: this.pageSize,
      totalPages: undefined,
      totalItems: 0,
      paginacion: true,
      userName : this.userName,
    },
    DT_filtros_com : {
      temasId: [],
      listId: [],
      min_info: false
    },
    cant_ranking : 10,
    get_comentarios: true
  }

  ngAfterViewInit() {
    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
    }
    
  }

  constructor(private dialog: MatDialog,
    private webapiService: WebapiService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    
    this.cargaParcial = false;
    this.set_estados();
    this.getData();
    
  }
  getData(): void {
    this.userName = localStorage.getItem('userName') || '';
    this.filtroInfo.PS_filtros_com.pageNumber = this.pageIndex + 1;  
    this.filtroInfo.PS_filtros_com.pageSize = this.pageSize;
    this.webapiService.getComentarios(this.userName, this.filtroInfo).subscribe((resp:any) => {
      this.dataSource = new MatTableDataSource(resp.result);
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.length = resp.filtroInfo.totalItems;
      if (this.dataSource) {
        this.cargaParcial = true;
      }
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

    dialogRef.afterClosed().subscribe((resp: any) => {
      this.procesarArchivo(resp['resp'], resp['clear_data']);
    });
  }

  set_estados(){
    this.userName = localStorage.getItem('userName') || '';
    this.webapiService.getInfo(this.userName, TipoInfo.Estados)
    .subscribe((user_stats: InfoGenerada) => {
      if (user_stats.stats_ct.estado == 1){
        this.analisisDisponible = false;
      }else{
        this.analisisDisponible = true;
      }
      if (user_stats.stats_ps.estado == 2){
        this.subiendoDatos = true;
      }else{
        this.subiendoDatos = false;
      }
      this.usuarioService.getEstado(user_stats);
    })
  }

  ejecutarAnalisis(){
    this.userName = localStorage.getItem('userName') || '';
    this.webapiService.getInfo(this.userName, TipoInfo.Estados)
    .subscribe((user_stats: InfoGenerada) => {
      if (user_stats.stats_ps.estado == 3 && user_stats.stats_ct.estado != 1 ) {
        this.analisisDisponible = false;
        this.usuarioService.getEstado(user_stats);
        this.webapiService.ejecutarAnalisis(this.userName, this.numTemas, this.predic_all)
        .subscribe(() => {
          this.analisisDisponible = true;
          this.usuarioService.clearEstado();
          this.ngOnInit();
        })
      }
    })    
  }

  procesarArchivo(info_archivo: any, clean_data_user: boolean){
    this.userName = localStorage.getItem('userName') || '';
    this.webapiService.getInfo(this.userName, TipoInfo.Estados)
    .subscribe((user_stats: InfoGenerada) => {
      if (user_stats.stats_ps.estado != 2 ) {        
        if (info_archivo &&  info_archivo.result ) {
          let idArchivo = info_archivo.result.id;
          // let clean_data_user = true;
          this.analisisDisponible = false;
          this.usuarioService.getEstado(user_stats);
          this.webapiService.procesarArchivo(this.userName, idArchivo , clean_data_user).subscribe((resp: any) => {
            this.analisisDisponible = true;
            this.usuarioService.clearEstado();
            this.showMessage(resp.displayMessage);            
            this.ngOnInit();
          });        
        }
      }
    })    
  }

  capitalizeFirstLetter(column: string): string {
    return column.charAt(0).toUpperCase() + column.slice(1);
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  }

  getIconClass(categoria: number): string {
    if (categoria === 2){
      return 'no-rotate';
    }
    if (categoria === 1){
      return 'rotate-90';
    }
    if (categoria === 0){
      return 'rotate-180';
    }
    return '';
  }

  showMessage(mng: string) {
    this.snackBar.open(mng, '', {
      duration: 7000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['transparent-snackbar']
    });
  }
  
}
