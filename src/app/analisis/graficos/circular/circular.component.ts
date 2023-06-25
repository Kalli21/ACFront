import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-circular',
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.css']
})
export class CircularComponent implements   OnChanges {

  @Input() info: IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };

  totalStr = '';
  items = [{
    "text": "Negativo",
    "color": "#B3261E"
  },
  {
    "text": "Neutro",
    "color": "#E5DC27"
  },
  {
    "text": "Positivo",
    "color": "#52AC56"
  }]

  single 
  // = [
  //   {
  //     "name": "Negativo",
  //     "value": 0
  //   },
  //   {
  //     "name": "Neutro",
  //     "value": 0
  //   },
  //   {
  //     "name": "Positivo",
  //     "value": 0
  //   }  
  // ];
  view: [number, number] = [300, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
 

  colorScheme = {
    domain: ['#52AC56', '#E5DC27','#B3261E' ], //R,A,V
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.single = [
      {
        "name": "Negativo",
        "value": 0
      },
      {
        "name": "Neutro",
        "value": 0
      },
      {
        "name": "Positivo",
        "value": 0
      }  
    ];
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.single[0].value = this.info.pos; 
    this.single[1].value = this.info.neg;
    this.single[2].value = this.info.net;
    Object.assign(this, { single: [...this.single] });
    this.changeDetectorRef.detectChanges();
  }
  
  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
