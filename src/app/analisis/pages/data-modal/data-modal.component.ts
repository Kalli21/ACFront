import { Component, Inject  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class DataModalComponent {
  dataSource: MatTableDataSource<any>;

  displayedColumns: string[] = []; // Aquí debes especificar las columnas de tu tabla

  constructor(
    public dialogRef: MatDialogRef<DataModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource = new MatTableDataSource(data);
    this.displayedColumns = Object.keys(data[0]); // Suponiendo que la primera fila contiene los nombres de las columnas
  }

  close(): void {
    this.dialogRef.close();
  }
}
