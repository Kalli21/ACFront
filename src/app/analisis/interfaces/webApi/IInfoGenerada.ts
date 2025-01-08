export interface InfoGenerada {
    general_info:  GrafInfo;
    producto_info: GrafInfo;
    stats_ct:      StatsCT;
    stats_dt:      StatsDt;
    stats_ps:      StatsPS;
}

interface GrafInfo {
    graf_rank_neg:   Graf[];
    graf_circulo:    StatsCT;
    graf_bar_cat:    Graf[];
    graf_rank_pos:   Graf[];
    graf_bar_date:   Graf[];
    graf_word_cloud: any[];
}

interface Graf {
    nombre:      string;
    total:       number;
    neg:         number;
    net:         number;
    pos:         number;
    correlativo: number;
}

interface StatsCT {
    net:     number;
    pos:     number;
    total:   number;
    neg:     number;
    estado?: number;
}

interface StatsDt {
    estado: number;
    total:  number;
}

interface StatsPS {
    estado: number;
}


export enum TipoInfo {
    All = 'all',
    General = 'general',
    Producto = 'producto',
    Estados = 'stats',
  }
