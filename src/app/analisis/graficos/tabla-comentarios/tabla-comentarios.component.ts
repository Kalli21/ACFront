import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tabla-comentarios',
  templateUrl: './tabla-comentarios.component.html',
  styleUrls: ['./tabla-comentarios.component.css']
})
export class TablaComentariosComponent implements OnChanges {

  @Input() comentarios:any = [];

  titulo = "Comentarios Recientes";
  displayedColumns: string[] = ['text', 'categoria', 'probabilidades']; // Aquí debes especificar las columnas de tu tabla
  dataSource: MatTableDataSource<any> | null = null;
  pageSizeOptions: number[] = [5, 10, 30 ];
  pageSize = 5;
  pageIndex = 0;
  length = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngAfterViewInit() {
    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["comentarios"] && this.comentarios) {
      this.dataSource = new MatTableDataSource(this.comentarios);
      this.length = this.comentarios.length;
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.length = this.length;
      this.dataSource.paginator = this.paginator;
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
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
}
