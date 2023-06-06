import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { IDataCSV } from '../../interfaces/IDataCSV';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class DataModalComponent {
  dataArchivo: any = [];
  dataSource?: MatTableDataSource<any>;
  displayedColumns: string[] = []; // Aquí debes especificar las columnas de tu tabla
  
  constructor(public dialogRef: MatDialogRef<DataModalComponent>) {}
  
  leerArchivo(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader: FileReader = new FileReader();

      reader.readAsText(file);

      reader.onload = (e: any) => {
        const csvData: string = e.target.result;
        this.procesarArchivo(csvData);
        this.dataSource = new MatTableDataSource(this.dataArchivo.slice(0, 3));
        this.displayedColumns = Object.keys(this.dataArchivo[0]);
      };
    }
  }

  private procesarArchivo(csvData: string){
    const list = csvData.split('\n');
    const listKey = list[0].trim().split(';');
    list.forEach((e, index) => {
      if (index === 0 || e.length===0) {
        return; // Omitir la primera iteración
      }
      const item = e.split(';')
      const objeto: IDataCSV = {};
      item.forEach((elemento, index) => {
          objeto[listKey[index]] = elemento.trim();   
      });
      this.dataArchivo.push(objeto);

    })
  }

  cancelar(): void {
    this.dialogRef.close([]);
  }
  continuar(): void {
    this.dialogRef.close(this.dataArchivo);
  }
}
