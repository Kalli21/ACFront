import { Component } from '@angular/core';
import { IClasStats } from '../../interfaces/clasModel/IClasStats';
import { IProducto } from '../../interfaces/predic_sentiment/IProducto';
import { GrafProductoService } from '../../services/dataInfo/graf-producto.service';
import { IBarInfo } from '../../interfaces/infoGraf/IBarInfo';
import { ProductoService } from '../../services/predict_sentiment/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent {

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
    private productoService: ProductoService) {


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
