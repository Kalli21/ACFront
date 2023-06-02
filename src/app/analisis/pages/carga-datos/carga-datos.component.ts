import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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

  constructor(private dialog: MatDialog) {}

  openCsvModal(): void {
    const dialogRef = this.dialog.open(DataModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('El modal se cerró');
        console.log('Datos leídos:', result);
        this.dataSource = new MatTableDataSource(result); // Asigna los datos al dataSource
        this.displayedColumns = Object.keys(result[0]); // Asigna las columnas
        this.length = result.length; // Actualiza la longitud total de los datos

        this.dataSource.paginator = this.paginator; // Asigna el paginador al dataSource
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
