import {XOR} from "ts-xor";

export type DateTime = Omit<DateTimeClass, 'timeToString' | 'dateToString'> & XOR<{isUTC: true, timezoneIdentifier: undefined}, {isUTC: false, timezoneIdentifier: string|undefined}>;
export type UTCDateTime = Omit<DateTime, 'isUTC' | 'timezoneIdentifier'> & {isUTC: true, timezoneIdentifier: undefined};

export class DateTimeClass {

    /**
     * Date property will be in local timezone for all non-UTC dates
     * Offset must be applied by the consumer function using the
     * referenced timezone definition or, possibly, a fallback if
     * it's a floating time definition.
     */
    readonly date: Date;
    readonly isDateOnly: boolean;
    readonly isUTC: boolean;
    readonly timezoneIdentifier: string|undefined;

    /**
     * @internal
     */
    constructor(date: Date, isDateOnly: boolean, isUTC: boolean, timezoneIdentifier: string|undefined) {
        this.date = date;
        this.isDateOnly = isDateOnly;
        this.isUTC = isUTC;
        this.timezoneIdentifier = timezoneIdentifier;
    }

    toString (): string {
        return `${this.dateToString()}${this.timeToString()}`;
    }

    toJSON (): string {
        return this.toString();
    }

    private timeToString () : string {
        if (this.isDateOnly) {
            return '';
        }

        if (this.isUTC) {
            return `T${this.date.getUTCHours().toString().padStart(2, '0')}${this.date.getUTCMinutes().toString().padStart(2, '0')}${this.date.getUTCSeconds().toString().padStart(2, '0')}Z`;
        }

        return `T${this.date.getHours().toString().padStart(2, '0')}${this.date.getMinutes().toString().padStart(2, '0')}${this.date.getSeconds().toString().padStart(2, '0')}`;
    }

    private dateToString () : string {
        if (this.isUTC) {
            return `${this.date.getUTCFullYear()}${(this.date.getUTCMonth() + 1).toString().padStart(2, '0')}${this.date.getUTCDate().toString().padStart(2, '0')}`;
        }

        return `${this.date.getFullYear().toString().padStart(2, '0')}${(this.date.getMonth() + 1).toString().padStart(2, '0')}${this.date.getDate().toString().padStart(2, '0')}`;
    }
}