import { IProducto } from "./IProducto";

export interface ICategoria {
  categoriaId: number;
  nombre: string;
  productos: IProducto[];
}

