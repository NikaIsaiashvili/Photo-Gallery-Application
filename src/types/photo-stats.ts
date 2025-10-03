export interface PhotoStats {
  id: string;
  slug: string;
  downloads: Downloads;
  views: Views;
}

export interface Downloads {
  total: number;
  historical: Historical;
}

export interface Historical {
  change: number;
  resolution: string;
  quantity: number;
  values: Value[];
}

export interface Value {
  date: string;
  value: number;
}

export interface Views {
  total: number;
  historical: Historical2;
}

export interface Historical2 {
  change: number;
  resolution: string;
  quantity: number;
  values: Value2[];
}

export interface Value2 {
  date: string;
  value: number;
}
