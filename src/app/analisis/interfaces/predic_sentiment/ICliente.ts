import { IComentario } from "./IComentario";

export interface ICliente {
  id?: number;
  nombre?: string;
  codCliente?: string;
  comentarios?: IComentario[];
  userName?: string;
}
