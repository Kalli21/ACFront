import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-map-tree',
  templateUrl: './map-tree.component.html',
  styleUrls: ['./map-tree.component.css']
})
export class MapTreeComponent implements OnChanges {

  @Input() dataTreeMapPos:any = [];
  @Input() dataTreeMapNeg:any = [];

  single:any = [];
  view: [number, number] = [300, 400];


  // options
  gradient: boolean = false;
  animations: boolean = true;

  colorScheme = {
    domain: ['#52AC56', '#A2C523', '#CBEA89', '#EEF9BE'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  botonSeleccionado = 'positivo'; // Valor inicial del botón seleccionado

  colorSchemePositivo = ['#52AC56', '#A2C523', '#CBEA89', '#EEF9BE'];
  colorSchemeNegativo = ['#B3261E', '#D45751', '#E69592', '#F7C6C4'];


  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.rankData(this.dataTreeMapPos);
  }
  onSelect(event: any) {
  }

  labelFormatting(c: any) {
    return `${(c.label)} Population`;
  }

  onButtonToggleChange(event: any) {

    if (event.value === 'positivo') {
      this.colorScheme = { ...this.colorScheme, domain: this.colorSchemePositivo };
      this.botonSeleccionado = 'positivo';
      this.rankData(this.dataTreeMapPos);
    } else if (event.value === 'negativo') {
      this.colorScheme = { ...this.colorScheme, domain: this.colorSchemeNegativo };
      this.botonSeleccionado = 'negativo';
      this.rankData(this.dataTreeMapNeg);
    }
  }

  rankData(data_rank: any) {
    if (data_rank && data_rank.length > 0) {
      this.single = []
      data_rank.forEach((element: any) => {
        const prod = element;
        const item = {
          "name": prod.nombre,
          "value": prod.correlativo
        }
        this.single.push(item)
      });
      Object.assign(this, { single: [...this.single] });
    }    
  }
}
