import isEnumValue from "../Util/isEnumValue";
import {CAPITAL_T, CAPITAL_Z, COMMA, EQUAL, HYPHEN_MINUS, PERIOD, QUOTES, SEMICOLON, SOLIDUS} from "./Constants";
import {DateTime, DateTimeClass, UTCDateTime} from "./ValueTypes/DateTime";
import {Period} from "./ValueTypes/Period";
import {Parameters} from "./Parameters/Parameters";
import {Duration, formatDuration} from "./ValueTypes/Duration";
import {Recur, RecurByWeekday, RecurFrequency, RecurModifier, RecurWeekday} from "./ValueTypes/Recur";

const matchDoubleQuotesString = `${QUOTES}([^${QUOTES}\\\\]*(\\\\.[^${QUOTES}\\\\]*)*)${QUOTES}`;
const escapedDoubleQuotesStringRegex = new RegExp(`^${matchDoubleQuotesString}$`);
const listStringRegex = new RegExp(`((${matchDoubleQuotesString})|([^${COMMA}]+))(${COMMA}|$)`, 'g');
const durationRegex = new RegExp(/^(?<sign>[-+])?P(?<weeks>\d+[.,]?\d*W)?(?<days>\d+[.,]?\d*D)?(?:T(?<hours>\d+[.,]?\d*H)?(?<minutes>\d+[.,]?\d*M)?(?<seconds>\d+[.,]?\d*S)?)?$/);
const byWeekdayRegex = new RegExp(/^((?<sign>[+-])?(?<offset>[0-9]{1,2}))?(?<weekday>MO|TU|WE|TH|FR|SA|SU)$/);

export interface ValueParserFn<T extends object = Record<string, unknown>> {
    (value: string, parameters: T): string|string[]|Period|DateTime|UTCDateTime|Duration|Recur|number
}

export function parseList (input: string) : string[] {
    const values = [];
    const matches = input.matchAll(listStringRegex);
    for (const match of matches) {
        const value = match[3] || match[1];
        values.push(value.replaceAll('\\"', '"'));
    }

    return values;
}

export function parseValueRaw (value: string) : string {
    const enquoted = value.match(escapedDoubleQuotesStringRegex);
    if (!enquoted || enquoted.length === 0) {
        return value;
    }

    return enquoted[1].replaceAll('\\"', '"');
}

export function parseNumber (value: string) : number {
    const number =  parseInt(value, 10);
    if (isNaN(number)) {
        throw new Error(`Invalid number value '${value}'`);
    }

    return number;
}

export function parseDateTime (value: string, parameters: Parameters.TimeZoneIdentifier) : DateTime {
    const isUTC = value.endsWith(CAPITAL_Z);
    const [date, time] = value.split(CAPITAL_T) as [string, string|undefined];
    const dateMatch = date.match(/^(?<year>[0-9]{4})(?<month>[0-1][0-9])(?<day>[0-3][0-9])Z?$/);
    if (!dateMatch || !dateMatch.groups) {
        throw new Error(`Invalid date value for date/datetime '${value}'`);
    }

    const timeMatch = time?.match(/^(?<hour>[0-2][0-9])(?<minute>[0-5][0-9])(?<second>[0-5][0-9])(?<UTC>[Z])?$/);
    if (time !== undefined && (!timeMatch || !timeMatch.groups)) {
        throw new Error(`Invalid time value for datetime '${value}'`);
    }

    const {year, month, day} = dateMatch.groups;
    const {hour, minute, second, UTC} = timeMatch?.groups || {hour: '00', minute: '00', second: '00', UTC: 'Z'};
    const dateInstance = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}${UTC || ''}`);
    if (isNaN(dateInstance.getTime())) {
        throw new Error(`Invalid datetime value '${value}': not a valid date/datetime`);
    }

    return new DateTimeClass(dateInstance, time === undefined, isUTC, parameters.TZID) as DateTime;
}

export function parseUTCDateTime (value: string) : UTCDateTime {
    const date = parseDateTime(value, {});
    if (!date.isUTC && !date.isDateOnly) {
        throw new Error(`Invalid UTC datetime value '${value}': value must be in UTC, but UTC delimiter is missing`);
    }

    return date as UTCDateTime;
}

export function parseDuration (value: string) : Duration {
    const matches = value.match(durationRegex);
    if (matches === null || matches.groups === undefined || value === 'P') {
        throw new Error(`Invalid duration value '${value}'`);
    }

    const duration: Duration = {
        inverted: matches.groups.sign === HYPHEN_MINUS,
        weeks: durationToNumber(matches.groups.weeks),
        days: durationToNumber(matches.groups.days),
        hours: durationToNumber(matches.groups.hours),
        minutes: durationToNumber(matches.groups.minutes),
        seconds: durationToNumber(matches.groups.seconds),
    };

    return {...duration, toString: () => formatDuration(duration), toJSON: () => formatDuration(duration)} as Duration;
}

function durationToNumber (input: string|undefined) : number|undefined {
    if (input === undefined) {
        return undefined;
    }

    return parseFloat(input.replace(',', '.'));
}

export function parsePeriod (value: string, parameters: Parameters.TimeZoneIdentifier) : Period {
    const [start, end] = value.split(SOLIDUS) as [string, string|undefined];
    if (end === undefined) {
        throw new Error(`Invalid period value '${value}': missing end/duration`);
    }

    if (end.startsWith(PERIOD)) {
        return {
            start: parseDateTime(start, parameters),
            duration: parseDuration(end),
        };
    }

    return {
        start: parseDateTime(start, parameters),
        end: parseDateTime(end, parameters),
    }
}

export function parseDateTimeOrPeriod (value: string, parameters: Parameters.ValueDataTypes & Parameters.TimeZoneIdentifier): DateTime|Period {
    if (parameters.VALUE === 'PERIOD') {
        return parsePeriod(value, parameters);
    }

    return parseDateTime(value, {});
}

export function parseUTCDateTimeOrDuration (value: string, parameters: Parameters.ValueDataTypes): UTCDateTime|Duration {
    if (parameters.VALUE === 'DATE-TIME') {
        return parseUTCDateTime(value);
    }

    return parseDuration(value);
}

export function parseRecurrence (value: string) : Recur {
    const parts = value.split(SEMICOLON).reduce((parts, part) => {
        const [key, value] = part.split(EQUAL);

        return {
            ...parts,
            ...{[key]: value},
        };
    }, {} as {[K: string]: undefined|string});

    if (parts.FREQ === undefined || !isEnumValue(RecurFrequency, parts.FREQ)) {
        throw new Error(`Invalid recurrence value '${value}': missing or invalid FREQ`);
    }

    const interval = parts.INTERVAL ? parseNumber(parts.INTERVAL) : undefined;
    if (interval !== undefined && interval <= 0) {
        throw new Error(`Invalid recurrence value '${value}': invalid non-positive INTERVAL`);
    }

    // BYMONTH, BYWEEKNO, BYYEARDAY, BYMONTHDAY, BYDAY, BYHOUR, BYMINUTE, BYSECOND
    const byMonth = parts.BYMONTH ? parseList(parts.BYMONTH).map(parseNumber).map(assertInRange(-12, 12, false)) : undefined;
    const byWeekNo = parts.BYWEEKNO ? parseList(parts.BYWEEKNO).map(parseNumber).map(assertInRange(-53, 51, false)) : undefined;
    const byYearday = parts.BYYEARDAY ? parseList(parts.BYYEARDAY).map(parseNumber).map(assertInRange(-366, 366, false)) : undefined;
    const byMonthday = parts.BYMONTHDAY ? parseList(parts.BYMONTHDAY).map(parseNumber).map(assertInRange(-31, 31, false)) : undefined;
    const byHour = parts.BYHOUR ? parseList(parts.BYHOUR).map(parseNumber).map(assertInRange(0, 23, true)) : undefined;
    const byMinute = parts.BYMINUTE ? parseList(parts.BYMINUTE).map(parseNumber).map(assertInRange(0, 59, true)) : undefined;
    const bySecond = parts.BYSECOND ? parseList(parts.BYSECOND).map(parseNumber).map(assertInRange(0, 60, true)) : undefined;
    const bySetPos = parts.BYSETPOS ? parseList(parts.BYSETPOS).map(parseNumber).map(assertInRange(-366, 366, false)) : undefined;

    const rrule: Recur = {
        frequency: parts.FREQ,
        byDay: parts.BYDAY ? parseByWeekdayList(parts.BYDAY) : undefined,
        byHour,
        byMinute,
        byMonth,
        byMonthday,
        bySecond,
        bySetPos,
        byWeekNo,
        byYearday,
        interval,
        weekstart: parts.WKST ? parseWeekday(parts.WKST) : undefined
    };

    if (parts.COUNT && parts.UNTIL) {
        throw new Error(`Invalid recurrence value '${value}': COUNT and UNTIL are mutually exclusive`);
    } else if (parts.COUNT) {
        rrule.count = parseNumber(parts.COUNT);
        rrule.until = undefined;
    } else if (parts.UNTIL) {
        rrule.until = parseDateTime(parts.UNTIL, {});
        rrule.count = undefined;
    }

    return {...rrule, toString: () => value} as Recur;
}

function assertInRange (min: number, max: number, allowZero: boolean) : (value: number) => number {
    return value => {
        if (notInRange(value, min, max, allowZero)) {
            throw new Error(`Invalid number: '${value.toString()}': not in range of ${min} to ${max}`);
        }

        return value;
    }
}

function notInRange (value: number, min: number, max: number, allowZero: boolean) : boolean {
    return value < min || value > max || (!allowZero && value === 0);
}

function parseWeekday (value: string): RecurWeekday {
    if (!isEnumValue(RecurWeekday, value)) {
        throw new Error(`Invalid recurrence weekday '${value}': not a valid weekday`);
    }

    return value;
}

function parseByWeekdayList (value: string) : RecurByWeekday[] {
    return parseList(value).map((definition, index) => {
        const matches = definition.match(byWeekdayRegex);
        if (matches === null || !matches.groups) {
            throw new Error(`Invalid recurrence weekday value '${value}' at index #${index}: invalid format`);
        }

        const {weekday, sign, offset} = matches.groups;

        return {
            weekday: parseWeekday(weekday),
            modifier: sign !== undefined && isEnumValue(RecurModifier, sign) ? sign : RecurModifier.None,
            offset: offset !== undefined ? parseNumber(offset) : 0,
        }
    });
}