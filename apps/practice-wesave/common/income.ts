export interface Income {
  income: number;
  startTime: number;
  quitTime: number;
  workday: string[];
  payday: number;
  additional?: number;
}
