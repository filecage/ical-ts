import {XOR} from "ts-xor";

export namespace ICS {
    import CALAddress = ICS.Types.CALAddress;
    import Duration = ICS.Types.Interval;
    export type NonStandardPropertyAware = { [key: `X-${string}`]: Value }
    export type IANAPropertyAware = { [key: `IANA-${string}`]: Value }

    export class Value<T = string> {
        private readonly key: string;
        public readonly value: T;
        private properties: {[key: string]: string} = {};
        constructor (key: string, value: T) {
            this.key = key;
            this.value = value;
        }

        set (key: string, value: string) : this {
            this.properties[key] = value;

            return this;
        }

        toString () : string {
            if (typeof this.value !== 'string') {
                throw new Error("Can not convert non-string ICSData.Value to string");
            }

            return this.value;
        }

        toJSON () : object|string {
            // If we have no properties we also don't export them to JSON
            if (Object.keys(this.properties).length === 0) {
                return this.toString();
            }

            return {
                key: this.key,
                __value__: this.value,
                ...this.properties
            };
        }
    }

    export namespace Types {
        export type Date = Value;
        export type Time = Value;
        export type DateTime = Value; // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
        export type Interval = Value; // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.2.5
        export type URI = Value;
        export type RRule = Value;
        export type GEO = Value<`${number};${number}`>;
        export type CALAddress = Value;
    }

    export type JSON = {
        VCALENDAR: VCALENDAR
    }

    export type VCALENDAR = NonStandardPropertyAware & IANAPropertyAware & {
        PRODID: Value,
        VERSION: Value<'2.0'>,         // This is he only value accepted by RFC5546 and RFC5545
        CALSCALE?: Value<'GREGORIAN'>, // This is the only value accepted by RFC5546 and RFC5545,
        COMMENT?: Value[],
        VEVENT?: VEVENT.Published[],
        VTIMEZONE?: VTIMEZONE[],
    };

    export type VTIMEZONE = NonStandardPropertyAware & IANAPropertyAware & {
        TZID: Value,
        TZURL?: Types.URI,
        'LAST-MODIFIED'?: Types.DateTime,
        DAYLIGHT?: TimezoneDefinition[],
        STANDARD?: TimezoneDefinition[]
    }

    export type TimezoneDefinition = NonStandardPropertyAware & IANAPropertyAware & {
        COMMENT?: Value[],
        TZOFFSETFROM: Value, // Example: -0800
        TZOFFSETTO: Value,   // Example: -0700
        DTSTART: Types.DateTime,    // In local format
        TZNAME?: Value
    } & XOR<{ RRULE?: Types.RRule }, {RDATE?: (Types.Date|Types.DateTime)[]}>

    export type VALARM = NonStandardPropertyAware & IANAPropertyAware & {
        ACTION: Value,
        TRIGGER: Duration,
        DESCRIPTION?: Value,
        SUMMARY?: Value,
        ATTENDEE?: CALAddress[],
    }

    export namespace VEVENT {
        import RRule = ICS.Types.RRule;
        import DateTime = ICS.Types.DateTime;
        export type Published = {DTSTART: Types.DateTime} & Event;

        type Event = NonStandardPropertyAware & IANAPropertyAware & {
            UID: Value,
            DTSTAMP: Types.DateTime,
            SUMMARY: Value,

            STATUS?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED',
            TRANSP?: 'OPAQUE' | 'TRANSPARENT',

            CLASS?: Value,
            CREATED?: Types.DateTime,
            DESCRIPTION?: Value,
            DTSTART?: Types.DateTime,
            GEO?: Types.GEO,
            'LAST-MODIFIED'?: Types.DateTime,
            'RECURRENCE-ID'?: Types.DateTime,
            LOCATION?: Value,
            ORGANIZER?: Types.CALAddress,
            ATTENDEE?: Types.CALAddress[],
            PRIORITY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            SEQUENCE?: Value,
            URL?: Types.URI,
            RECURID?: Value,
            RRULE?: RRule,
            RDATE?: DateTime[],
            EXDATE?: DateTime[],
            COMMENT?: Value[],
            CATEGORIES?: Value,
            VALARM?: VALARM[],
        } & XOR<{DTEND?: Types.DateTime}, {DURATION?: Types.Interval}>
    }

}