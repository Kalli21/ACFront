export interface IInfoFiltro {
    CT_filtro_com: CTfiltrocom;
    PS_filtros_com: PSfiltroscom;
    DT_filtros_com: DTfiltroscom;
    cant_ranking: number;
    get_comentarios?: boolean;
}

interface DTfiltroscom {
    fechaIni?: string;
    fechaFin?: string;
    temasId?: number[];
    listId?: string[];
    min_info?: boolean;
}

interface PSfiltroscom {
    pageNumber?: number
    pageSize?: number
    totalPages?: number
    totalItems?: number
    paginacion?: boolean
    fechaIni?: string
    fechaFin?: string
    idProducto?: string
    categoriasId?: number[]
    userName?: string
}

interface CTfiltrocom {
    fechaIni?: string;
    fechaFin?: string;
    categoriasId?: number[];
    listId?: string[];
}