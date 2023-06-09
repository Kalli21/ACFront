import { Component, OnInit } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';
import { SentimentPredictService } from '../../services/clasModel/sentiment-predict.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  userName=''
  data :any
  constructor(private sentimentPredictService: SentimentPredictService) {
  }
  ngOnInit(): void {
    this.obtenerData();
  }

  obtenerData() {
    const userName = localStorage.getItem('userName') || '';
    this.sentimentPredictService.getStast(userName).subscribe( (d: any) =>{
      this.data = d;
    });
    
  }


}
