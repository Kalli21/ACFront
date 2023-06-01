import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataModalComponent } from '../data-modal/data-modal.component';
import { IDataCSV } from '../../interfaces/IDataCSV';



@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrls: ['./carga-datos.component.css']
})
export class CargaDatosComponent {

  dataArchivo: any = [];

  @ViewChild('fileInput') fileInput: any;

  constructor(private dialog: MatDialog) { }

  leerArchivo(event: any) {
    const file: File = event.target.files[0];

  
    if (file) {
      const reader: FileReader = new FileReader();

      reader.readAsText(file);

      reader.onload = (e: any) => {
        const csvData: string = e.target.result;
        this.procesarArchivo(csvData);
        this.openCsvModal();

      };
    }

  }

  openCsvModal(): void {
    const dialogRef = this.dialog.open(DataModalComponent, {
      // Aquí puedes enviar los datos del archivo CSV al modal si es necesario
      data: this.dataArchivo.slice(0, 5),
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }

  private procesarArchivo(csvData: string) {

    const list = csvData.split('\n');
    const listKey = list[0].split(';');
    list.forEach((e, index) => {
      if (index === 0) {
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

  

}
