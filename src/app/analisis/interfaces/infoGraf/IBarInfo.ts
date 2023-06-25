export interface IBarInfo {
  name: string;
  series: Series[];
}

interface Series {
  name: string;
  value: number;
}