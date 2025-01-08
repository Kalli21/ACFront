import { Component } from '@angular/core';
import { WebapiService } from '../../services/webapi/webapi.service';
import { MatDialogRef } from '@angular/material/dialog';
import { IDataCSV } from '../../interfaces/predic_sentiment/IDataCSV';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})

export class DataModalComponent {
  dataArchivo: any[] = [];
  dataSource?: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  
  file?: File;
  sep_val = '|';
  fin_linea = '\n'; // Valor por defecto
  csvOriginal = ''; // Copia del CSV original cargado
  userName = localStorage.getItem('userName') || '';
  
  clear_data = false;

  constructor(private webapiService: WebapiService,private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<DataModalComponent>) {}

  leerArchivo(event: any): void {
    const file: File = event?.target?.files?.[0];
    if (!file) return;
    this.file = file; 
    const reader: FileReader = new FileReader();
    reader.readAsText(file);

    reader.onload = (e: any) => {
      const csvData: string = e.target.result;
      this.csvOriginal = csvData; // Guardar el CSV original
      this.procesarArchivo(csvData);
    };

    reader.onerror = () => {
      console.error('Error al leer el archivo');
    };
  }

  reProcesarArchivo(): void {
    if (this.csvOriginal.trim()) {
      this.procesarArchivo(this.csvOriginal); // Usar el CSV original para reprocesar
    }
  }

  private procesarArchivo(csvData: string): void {
    if (!csvData.trim()) {
      console.error('El archivo está vacío');
      return;
    }
    if (this.fin_linea.trim() == '') {
      this.fin_linea = '\n';
    }
    // Limpiar datos previos
    this.dataArchivo = [];

    const filas = csvData.split(this.fin_linea).filter((fila) => fila.trim().length > 0);    
    
    if (filas.length === 0) {
      console.error('No se encontraron datos válidos');
      return;
    }

    const cabeceras = filas[0].trim().split(this.sep_val);
    const maxRows = 10;

    filas.slice(1, maxRows + 1).forEach((fila) => {
      const valores = fila.split(this.sep_val);
      const objeto: IDataCSV = {};
      cabeceras.forEach((columna, index) => {
        objeto[columna.trim()] = valores[index]?.trim() || '';
      });
      this.dataArchivo.push(objeto);
    });

    this.actualizarTabla();
  }

  actualizarTabla(): void {
    this.dataSource = new MatTableDataSource(this.dataArchivo);
    this.displayedColumns = this.dataArchivo.length > 0 ? Object.keys(this.dataArchivo[0]) : [];
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  continuar(): void {
    this.userName = localStorage.getItem('userName') || '';
    if (!this.file) {
      this.showMessage('Por favor, selecciona un archivo.');
      return;
    }
    if (!this.userName.trim()) {
      this.showMessage('Error, no se encuentra el userName.');
      return;
    }    
    this.webapiService.subirArchivo(this.userName, this.sep_val, this.fin_linea, this.file)
    .subscribe({
      next: (resp: any) => {
        this.showMessage('Archivo subido exitosamente.');
        this.dialogRef.close({'resp': resp, 'clear_data': this.clear_data});
      },
      error: (err) => {
        console.error('Error al subir el archivo:', err);
        this.showMessage('Error al subir el archivo.');
      },
    });
  }

  showMessage(mng: string) {
    this.snackBar.open(mng, '', {
      duration: 5000, // 5 segundos
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: ['transparent-snackbar']
    });
  }

}
