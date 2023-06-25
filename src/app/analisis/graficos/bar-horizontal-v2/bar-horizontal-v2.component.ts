import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';

@Component({
  selector: 'app-bar-horizontal-v2',
  templateUrl: './bar-horizontal-v2.component.html',
  styleUrls: ['./bar-horizontal-v2.component.css']
})
export class BarHorizontalV2Component implements OnChanges{

  @Input() dataBarHorizontal:IBarInfo[] = [];
  @Input() yLabel:string = '';
  @Input() xLabel:string = '';
  @Input() titulo:string = '';


  multi:any = [];
  

  view: [number, number] = [300, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = this.yLabel;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = this.xLabel;
  legendPosition: LegendPosition = LegendPosition.Below;

  colorScheme = {
    domain: ['#B3261E', '#E5DC27' , '#52AC56'],
    group: ScaleType.Ordinal,
    selectable: true,
    name: 'Customer Usage',
  };

  constructor() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    Object.assign(this, { multi: this.dataBarHorizontal });
  }

  onSelect(event: any) {
    console.log(event);
  }

  
}
