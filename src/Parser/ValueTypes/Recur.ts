import {XOR} from "ts-xor";
import {DateTime} from "./DateTime";

export type Recur = {
    frequency: RecurFrequency,
    interval?: number,
    bySecond?: number[],
    byMinute?: number[],
    byHour?: number[],
    byDay?: RecurByWeekday[],
    byMonthday?: number[],
    byYearday?: number[],
    byWeekNo?: number[],
    byMonth?: number[],
    bySetPos?: number[],
    weekstart?: RecurWeekday,
} & XOR<{until?: DateTime}, {count?: number}>;

export type RecurByWeekday = {
    weekday: RecurWeekday,
    modifier: RecurModifier,
    offset: number,
}

export enum RecurModifier {
    None = '',
    Minus = '-',
    Plus = '+',
}

export enum RecurFrequency {
    Secondly = 'SECONDLY',
    Minutely = 'MINUTELY',
    Hourly = 'HOURLY',
    Daily = 'DAILY',
    Weekly = 'WEEKLY',
    Monthly = 'MONTHLY',
    Yearly = 'YEARLY',
}

export enum RecurWeekday {
    Sunday = 'SU',
    Monday = 'MO',
    Tuesday = 'TU',
    Wednesday = 'WE',
    Thursday = 'TH',
    Friday = 'FR',
    Saturday = 'SA',
}