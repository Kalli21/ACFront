import { Component, Input, OnInit } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-horizontal',
  templateUrl: './bar-horizontal.component.html',
  styleUrls: ['./bar-horizontal.component.css']
})
export class BarHorizontalComponent implements OnInit{
  
  @Input() dataCategoria:any = []
  
  multi:any = [];
  
  items = [{
    "text": "hola",
    "color": "black"
  },
  {
    "text": "hola",
    "color": "black"
  },
  {
    "text": "hola",
    "color": "black"
  }]

  view: [number, number] = [300, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Categoría';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Cantidad';
  legendPosition: LegendPosition = LegendPosition.Below;

  colorScheme = {
    domain: ['#B3261E', '#E5DC27' , '#52AC56'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor() {
  }
  ngOnInit(): void {
    this.dataCategoria.forEach((cat:any) => {
      const item = {
        "name": cat.nombre,
        "series": [
          {
            "name": "Negativo",
            "value": cat.stats.neg
          },
          {
            "name": "Neutro",
            "value": cat.stats.net
          },
          {
            "name": "Positivo",
            "value": cat.stats.pos
          }
        ]
      }
      this.multi.push(item)
    });
    
    Object.assign(this, { multi: [...this.multi] });
  }

  onSelect(event: any) {
    console.log(event);
  }

  
  
}
