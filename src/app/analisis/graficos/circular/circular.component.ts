import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-circular',
  templateUrl: './circular.component.html',
  styleUrls: ['./circular.component.css']
})
export class CircularComponent implements OnChanges {

  @Input() info: IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  }
  totalStr = "22"
  items = [{
    "text": "hola",
    "color": "black"
  }]

  single = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
    {
      "name": "UK",
      "value": 6200000
    }
  ];
  view: [number, number] = [300, 300];

  // options
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: LegendPosition = LegendPosition.Below;
 

  colorScheme = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor() {
    Object.assign(this, { single: this.single });
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
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
