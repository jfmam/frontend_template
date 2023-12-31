export interface Income {
  income: number;
  startTime: number;
  quitTime: number;
  workday: number[];
  payday: number;
  additional?: number;
}
