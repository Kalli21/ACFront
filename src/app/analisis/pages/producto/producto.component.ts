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

  constructor(private grafProductoService: GrafProductoService,
    private productoService: ProductoService,
    private descargaPDFService: DescargaPDFService) {
      this.descargaPDFService.downloadProductoView$.subscribe(() => {
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

    this.grafProductoService.infoCirculo$.subscribe((data: IClasStats) => {
      this.infoCirculo = data;
    });
    
    this.grafProductoService.dataBarHorizontal$.subscribe((data: IBarInfo[] ) => {
      this.dataBarHorizontal = data;
    });

    this.grafProductoService.dataWordCloud$.subscribe((data: any[] ) => {
      this.dataWordCloud = data;
    });

    this.grafProductoService.dataComentarios$.subscribe((data: any[] ) => {      
      this.dataComentarios = data;
    });

  }

  onInfoProducto(infoProducto: IProducto) {
    this.productoService.getProducto(infoProducto.id).subscribe( (d:any) => this.infoProducto = d.result );    
  }

}
