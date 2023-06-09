import { Component } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-map-tree',
  templateUrl: './map-tree.component.html',
  styleUrls: ['./map-tree.component.css']
})
export class MapTreeComponent {
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
      "name": "Italy",
      "value": 4500000
    },
    {
      "name": "Spain",
      "value": 5730000
    },{
      "name": "UK",
      "value": 8200000
    }
  ];
  view: [number, number] = [300, 400];

  // options
  gradient: boolean = false;
  animations: boolean = true;

  colorScheme = {
    domain: ['#99CCE5', '#FF7F7F'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor() {
    Object.assign(this, { single: this.single });
  }

  onSelect(event:any) {
    console.log(event);
  }

  labelFormatting(c:any) {
    return `${(c.label)} Population`;
  }
}
