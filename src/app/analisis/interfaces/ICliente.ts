import { IComentario } from "./IComentario";

export interface ICliente {
  clienteId: number;
  nombre: string;
  codCliente: string;
  comentarios: IComentario[];
  userName: string;
}
