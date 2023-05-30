import { IComentario } from "./IComentario";

export interface IProducto {
    productoId: number;
    nombre: string;
    descripcion: string;
    precio: number;
    usuarioId: number;
    categoriaId: number;
    comentarios: IComentario[];
  }