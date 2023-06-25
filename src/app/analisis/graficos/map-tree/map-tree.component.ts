import { Component, Input, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-map-tree',
  templateUrl: './map-tree.component.html',
  styleUrls: ['./map-tree.component.css']
})
export class MapTreeComponent implements OnInit {

  @Input() dataTreeMap:any = [];

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
  ngOnInit(): void {
    this.rankPos();
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
      this.rankPos();
    } else if (event.value === 'negativo') {
      this.colorScheme = { ...this.colorScheme, domain: this.colorSchemeNegativo };
      this.botonSeleccionado = 'negativo';
      this.rankNeg();
    }
  }

  rankPos() {
    if (this.dataTreeMap) {
      this.single = []
      for (let i = 0; i < 5; i++) {
        const prod = this.dataTreeMap[i];
        const item = {
          "name": prod.nombre,
          "value": prod.stats.pos
        }
        this.single.push(item)
      }
      Object.assign(this, { single: [...this.single] });
    }
    
  }

  rankNeg() {
    if (this.dataTreeMap) {
      this.single = []
      for (let i = this.dataTreeMap.length - 1; i >= this.dataTreeMap.length - 5; i--) {
        const prod = this.dataTreeMap[i];
  
        const item = {
          "name": prod.nombre,
          "value": prod.stats.pos
        }
        this.single.push(item)
      }
      Object.assign(this, { single: [...this.single] });
    }
    
  }


}
