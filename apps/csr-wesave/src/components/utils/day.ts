import { format } from 'date-fns';

export const dueDay = (actionDay: string[]) => (actionDay.length !== 7 ? actionDay.join('·') : '매일');
export const convertIsoDate = (date: Date) => format(new Date(date), 'yyyy.MM.dd');
