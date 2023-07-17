import {COMMA} from "./Constants";
import {DateTime} from "./ValueTypes/DateTime";
import {Period} from "./ValueTypes/Period";
import {Parameters} from "./Parameters/Parameters";

export interface ValueParserFn<T extends {} = {}> {
    (value: string, parameters: T): string|string[]|Period|DateTime|number
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

export function parseDateTimeOrPeriod (value: string, parameters: Parameters.ValueDataTypes): DateTime|Period {
    if (parameters.VALUE === 'PERIOD') {
        return parsePeriod(value);
    }

    return parseDateTime(value);
}