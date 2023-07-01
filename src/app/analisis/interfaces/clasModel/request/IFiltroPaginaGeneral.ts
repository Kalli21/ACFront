import { ICategoria } from "../../predic_sentiment/ICategoria";

export interface IFiltroPaginaGeneral {
  categorias: ICategoria[];
  filtrosSentimiento: number[];
}
