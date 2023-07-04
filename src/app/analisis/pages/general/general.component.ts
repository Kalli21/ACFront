import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GrafGeneralService } from '../../services/dataInfo/graf-general.service';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { ICategoria } from '../../interfaces/predic_sentiment/ICategoria';
import { DescargaPDFService } from '../../services/dataInfo/descarga-pdf.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  @ViewChild('content') content!: ElementRef;
  userName=''
  infoCirculo : IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };
  
  tituloBarVertical = "Setimiento por Mes";
  dataBarVertical: IBarInfo[] = [];
  
  tituloBarHorizontal = "Setimiento por Categoria";
  dataBarHorizontal: IBarInfo[] = [];

  dataTreeMap: any = []
  dataWordCloud: any = []

  constructor(private grafGeneralService:GrafGeneralService,
    private descargaPDFService: DescargaPDFService) {
      this.descargaPDFService.downloadGeneralView$.subscribe(() => {
        this.downloadAsPDF();
      });
  }
  
  downloadAsPDF() {
    const doc = new jsPDF();
    const content = this.content.nativeElement;
  
    // Aplicar estilo CSS para establecer el fondo negro
    content.style.background = '#303030';
  
    const options = {
      scale: 2, // Ajustar la escala de la captura (2 significa 2 veces más grande)
      useCORS: true, // Permitir el uso de recursos de origen cruzado (Cross-Origin)
      logging: true, // Habilitar el registro de eventos en la consola
      windowWidth: document.documentElement.clientWidth, // Ancho de la ventana actual
      windowHeight: document.documentElement.clientHeight // Alto de la ventana actual
    };
  
    html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      // Dibujar un rectángulo blanco en el fondo de la página
      doc.rect(0, 0, pdfWidth, pdfHeight, 'F');
  
      // Agregar la imagen capturada del contenido
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.save('Reporte.pdf');
  
      // Restaurar el estilo CSS original
      content.style.background = 'none';
    });
  }
  

  ngOnInit() {
    this.grafGeneralService.infoCirculo$.subscribe((data: IClasStats) => {
      this.infoCirculo = data;
    });
    this.grafGeneralService.dataMapTreeTop$.subscribe((data: any[] ) => {      
      this.dataTreeMap = data;
    });
    this.grafGeneralService.dataBarHorizontal$.subscribe((data: any[] ) => {
      this.dataBarHorizontal = procesarDataHorizontal(data);
       
    });
    this.grafGeneralService.dataWordCloud$.subscribe((data: any[] ) => {
      this.dataWordCloud = data;
    });
    this.grafGeneralService.dataBarVertical$.subscribe((data: IBarInfo[] ) => {
      this.dataBarVertical = data;
    });
    
  }

}
function procesarDataHorizontal(data: ICategoria[]): IBarInfo[] {
  let resp: IBarInfo[] = [];
  data.forEach((cat:any) => {
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
    resp.push(item)
  });
  return resp;
}

