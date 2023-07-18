import {COMMA, QUOTES} from "./Constants";
import {DateTime} from "./ValueTypes/DateTime";
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

export function parseDateTime (value: string) : DateTime {
    // TODO: Implement
    return value;
}

export function parsePeriod (value: string) : Period {
    // TODO: Implement
    return {
        start: "",
        end: ""
    }
}

export function parseDateTimeOrPeriod (value: string, parameters: Parameters.ValueDataTypes): DateTime|Period {
    if (parameters.VALUE === 'PERIOD') {
        return parsePeriod(value);
    }

    return parseDateTime(value);
}