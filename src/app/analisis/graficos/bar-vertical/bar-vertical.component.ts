import { Component, Input, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.css']
})
export class BarVerticalComponent implements OnInit{

  @Input() dataBarFecha: any = []

  multi:any = [  ];

  items = [{
    "text": "hola",
    "color": "black"
  }]

  view: [number, number] = [1200, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Fecha';
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Cantidad';
  animations: boolean = true;

  colorScheme = {
    domain: ['#B3261E', '#E5DC27' , '#52AC56'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  constructor() {

  }
  ngOnInit(): void {
    this.multi = []
    this.iterateData();
   
  }

  onSelect(event: any) {
    console.log(event);
  }

  iterateData() {
    for (let year in this.dataBarFecha) {
      
      let months = this.dataBarFecha[year];
      
      for (let month in months) {
        
        let categoriaCount = months[month][1][0][1];
        ////
        const item = {
          "name": year +' - ' + month,
          "series": [
            {
              "name": "Negativo",
              "value": categoriaCount[0]
            },
            {
              "name": "Neutro",
              "value": categoriaCount[1]
            },
            {
              "name": "Positivo",
              "value": categoriaCount[2]
            }
          ]
        }
        this.multi.push(item)
      
      
        Object.assign(this, { multi: [...this.multi] });
        
      }
    }
  }
}
