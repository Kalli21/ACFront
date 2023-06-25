import { Component, Input } from '@angular/core';
import { IProducto } from '../../interfaces/predic_sentiment/IProducto';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.css']
})
export class CardProductoComponent {
  @Input() infoProducto:IProducto= {
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

}
