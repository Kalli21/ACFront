import { ICategoria } from "./ICategoria";
import { IComentario } from "./IComentario";

export interface IProducto {
  id: number;
  codProducto: string;
  nombre: string;
  descripcion: string;
  precio: number;
  urlImg: string;
  usuarioId: number;
  categorias: ICategoria[];
  comentarios: IComentario[];
}
