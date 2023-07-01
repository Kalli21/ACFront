import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-vertical',
  templateUrl: './bar-vertical.component.html',
  styleUrls: ['./bar-vertical.component.css']
})
export class BarVerticalComponent implements OnChanges{

  @Input() dataBarFecha: any = []
  @Input() yLabel:string = '';
  @Input() xLabel:string = '';
  @Input() titulo:string = '';

  multi:any = [  ];


  view: [number, number] = [1200, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = this.yLabel;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = this.xLabel;
  animations: boolean = true;

  colorScheme = {
    domain: ['#B3261E', '#E5DC27' , '#52AC56'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };
  constructor() {

  }


  ngOnChanges(changes: SimpleChanges): void {
    // this.multi = []
    // this.iterateData();
    Object.assign(this, { multi: this.dataBarFecha });
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
