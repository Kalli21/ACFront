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
    Object.assign(this, { multi: this.dataBarFecha });
  }

  onSelect(event: any) {
    console.log(event);
  }

  iterateData() {
    
    this.dataBarFecha.forEach((element: any) => {
      const item = {
        "name": element.nombre,
        "series": [
          {
            "name": "Negativo",
            "value": element.neg
          },
          {
            "name": "Neutro",
            "value": element.net
          },
          {
            "name": "Positivo",
            "value": element.pos
          }
        ]
      }
      this.multi.push(item)
    });
    Object.assign(this, { multi: [...this.multi] });   
  }
}
