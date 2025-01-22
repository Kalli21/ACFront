import { Component, ElementRef, ViewChild } from '@angular/core';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { IProducto } from '../../interfaces/predic_sentiment/IProducto';
import { GrafProductoService } from '../../services/dataInfo/graf-producto.service';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { ProductoService } from '../../services/predict_sentiment/producto.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DescargaPDFService } from '../../services/dataInfo/descarga-pdf.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {
  @ViewChild('content') content!: ElementRef;
  userName = ''
  infoCirculo: IClasStats = {
    net: 0,
    pos: 0,
    neg: 0,
    total: 0
  };

  infoProducto: IProducto = {
    id: 0,
    codProducto: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    urlImg: '',
    usuarioId: 0,
    categorias: [],
    comentarios: []
  }
  
  tituloBarHorizontal = "Setimiento por Mes";
  dataBarHorizontal: IBarInfo[] = [];

  dataWordCloud: any = [];
  dataComentarios: any = [];
  filtro: any ={
    totalItems: 0,
  }

  constructor(private grafProductoService: GrafProductoService,
    private productoService: ProductoService,
    private descargaPDFService: DescargaPDFService) {
      this.descargaPDFService.downloadProductoView$.subscribe(() => {
        this.downloadAsPDF();
      });
  }

  downloadAsPDF() {
    const content = this.content.nativeElement;
    
    const options = {
      scale: 3, // Aumentar la escala para mayor resolución
      useCORS: true,
      logging: true,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      useWebGL: true // Usar WebGL para renderizado
    };
  
    function applyCaptureStyles(element: HTMLElement) {
      element.style.background = '#303030';
      element.style.color = 'white';
    }
  
    function resetCaptureStyles(element: HTMLElement) {
      element.style.background = '';
      element.style.color = '';
    }
  
    applyCaptureStyles(content);
    html2canvas(content, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('Reporte.pdf');
      resetCaptureStyles(content);
    }).catch((error) => {
      console.error('Error al generar el PDF:', error);
    });
  }
  
  
  

  ngOnInit() {

    this.grafProductoService.infoCirculo$.subscribe((data: IClasStats) => {
      this.infoCirculo = data;
    });
    
    this.grafProductoService.dataBarHorizontal$.subscribe((data: IBarInfo[] ) => {
      this.dataBarHorizontal = data;
    });

    this.grafProductoService.dataWordCloud$.subscribe((data: any[] ) => {
      this.dataWordCloud = data; 
    });

    this.grafProductoService.dataComentarios$.subscribe((data: any ) => {      
      this.dataComentarios = data.result;
      this.filtro = data.filtroInfo;
    });
  }

  onInfoProducto(infoProducto: IProducto) {
    this.productoService.getProducto(infoProducto.id).subscribe( (d:any) => {
      this.infoProducto = d.result 
    });    
  }

}
