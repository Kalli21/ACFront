import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';

@Component({
  selector: 'app-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.css'],
})
export class WordCloudComponent implements OnChanges {
  
  @Input() dataWordCloud: any = [];

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the width of the upper element multiplied by the value
    width: 300,
    // if height is between 0 and 1 it will be set to the height of the upper element multiplied by the value
    height: 400,
    overflow: false,
  };

  data: CloudData[] = [
    // Agrega más palabras y sus pesos aquí
  ];
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const dataWordCloudChange = changes['dataWordCloud'];
    if (dataWordCloudChange && dataWordCloudChange.currentValue) {
      this.data = this.mapDataToCloudData(dataWordCloudChange.currentValue);
    }
  }

  private mapDataToCloudData(data: any[]): CloudData[] {
    return data.map((item) => {
      const valueKey = Object.keys(item)[0];
      const value = item[valueKey];

      return {
        text: value,
        weight: parseFloat(valueKey),
      };
    });
  }
}
