import {CAPITAL_T, CAPITAL_Z, COMMA, QUOTES} from "./Constants";
import {DateTime, DateTimeClass, UTCDateTime} from "./ValueTypes/DateTime";
import {Period} from "./ValueTypes/Period";
import {Parameters} from "./Parameters/Parameters";

const matchDoubleQuotesString = `${QUOTES}([^${QUOTES}\\\\]*(\\\\.[^${QUOTES}\\\\]*)*)${QUOTES}`;
const escapedDoubleQuotesStringRegex = new RegExp(`^${matchDoubleQuotesString}$`);
const listStringRegex = new RegExp(`((${matchDoubleQuotesString})|([^${COMMA}]+))(${COMMA}|$)`, 'g');

export interface ValueParserFn<T extends {} = {}> {
    (value: string, parameters: T): string|string[]|Period|DateTime|number
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
    return parseInt(value);
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

    return new DateTimeClass(new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}${UTC || ''}`), time === undefined, isUTC, parameters.TZID) as DateTime;
}

export function parseUTCDateTime (value: string) : UTCDateTime {
    const date = parseDateTime(value, {});
    if (!date.isUTC && !date.isDateOnly) {
        throw new Error(`Invalid UTC datetime value '${value}': value must be in UTC, but UTC delimiter is missing`);
    }

    return date as UTCDateTime;
}

export function parsePeriod (value: string) : Period {
    // TODO: Implement
    return {
        start: parseDateTime("", {}),
        end: parseDateTime("", {}),
    }
}

export function parseDateTimeOrPeriod (value: string, parameters: Parameters.ValueDataTypes): DateTime|Period {
    if (parameters.VALUE === 'PERIOD') {
        return parsePeriod(value);
    }

    return parseDateTime(value, {});
}