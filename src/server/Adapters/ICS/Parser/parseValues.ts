import {COMMA} from "../ParserConstants";
import {DateTime} from "./ValueTypes/DateTime";
import {Period} from "./ValueTypes/Period";

export interface ValueParserFn {
    (value: string): string|string[]|Period|DateTime|number
}

export function parseList (value: string) : string[] {
    // TODO: Implement correct handling for values in quotes
    return value.split(COMMA);
}

export function parseValueRaw (value: string) : string {
    return value;
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

export function parseTimeTransparency (value: string) {
    value = value.toUpperCase();
    if (value === 'OPAQUE') {
        return value;
    } else if (value === 'TRANSPARENT') {
        return value;
    }

    throw new Error(`Invalid value for 'TimeTransparency' property: '${value}'`);
}