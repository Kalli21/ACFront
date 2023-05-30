import { IComentario } from "./IComentario";

export interface ICliente {
  clienteId: number;
  nombre: string;
  comentarios: IComentario[];
}
