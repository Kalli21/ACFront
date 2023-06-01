import { IComentario } from "./IComentario";

export interface IProducto {
    productoId: number;
    codProduct: string;
    nombre: string;
    descripcion: string;
    precio: number;
    urlImg: string;
    usuarioId: number;
    categoriaId: number;
    comentarios: IComentario[];
  }
