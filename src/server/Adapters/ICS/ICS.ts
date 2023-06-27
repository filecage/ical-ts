import {XOR} from "ts-xor";

export namespace ICS {
    import CALAddress = ICS.Types.CALAddress;
    import Duration = ICS.Types.Interval;
    export type NonStandardPropertyAware = { [key: `X-${string}`]: Property }
    export type IANAPropertyAware = { [key: `IANA-${string}`]: Property }

    export class Property<T = string> {
        private readonly key: string;
        public readonly value: T;
        private parameters: {[key: string]: string} = {};
        constructor (key: string, value: T) {
            this.key = key;
            this.value = value;
        }

        set (key: string, value: string) : this {
            this.parameters[key] = value;

            return this;
        }

        toString () : string {
            if (typeof this.value !== 'string') {
                throw new Error("Can not convert non-string ICSData.Value to string");
            }

            return this.value;
        }

        toJSON () : object|string {
            // If we have no parameters we also don't export them to JSON
            if (Object.keys(this.parameters).length === 0) {
                return this.toString();
            }

            return {
                key: this.key,
                __value__: this.value,
                ...this.parameters
            };
        }
    }

    export namespace Types {
        export type Date = Property;
        export type Time = Property;
        export type DateTime = Property; // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.3.5
        export type Interval = Property; // @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.2.5
        export type URI = Property;
        export type RRule = Property;
        export type GEO = Property<`${number};${number}`>;
        export type CALAddress = Property;
    }

    export type JSON = {
        VCALENDAR: VCALENDAR
    }

    export type VCALENDAR = NonStandardPropertyAware & IANAPropertyAware & {
        PRODID: Property,
        VERSION: Property<'2.0'>,         // This is he only value accepted by RFC5546 and RFC5545
        CALSCALE?: Property<'GREGORIAN'>, // This is the only value accepted by RFC5546 and RFC5545,
        COMMENT?: Property[],
        VEVENT?: VEVENT.Published[],
        VTIMEZONE?: VTIMEZONE[],
    };

    export type VTIMEZONE = NonStandardPropertyAware & IANAPropertyAware & {
        TZID: Property,
        TZURL?: Types.URI,
        'LAST-MODIFIED'?: Types.DateTime,
        DAYLIGHT?: TimezoneDefinition[],
        STANDARD?: TimezoneDefinition[]
    }

    export type TimezoneDefinition = NonStandardPropertyAware & IANAPropertyAware & {
        COMMENT?: Property[],
        TZOFFSETFROM: Property, // Example: -0800
        TZOFFSETTO: Property,   // Example: -0700
        DTSTART: Types.DateTime,    // In local format
        TZNAME?: Property
    } & XOR<{ RRULE?: Types.RRule }, {RDATE?: (Types.Date|Types.DateTime)[]}>

    export type VALARM = NonStandardPropertyAware & IANAPropertyAware & {
        ACTION: Property,
        TRIGGER: Duration,
        DESCRIPTION?: Property,
        SUMMARY?: Property,
        ATTENDEE?: CALAddress[],
    }

    export namespace VEVENT {
        import RRule = ICS.Types.RRule;
        import DateTime = ICS.Types.DateTime;
        export type Published = {DTSTART: Types.DateTime} & Event;

        type Event = NonStandardPropertyAware & IANAPropertyAware & {
            UID: Property,
            DTSTAMP: Types.DateTime,
            SUMMARY: Property,

            STATUS?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED',
            TRANSP?: 'OPAQUE' | 'TRANSPARENT',

            CLASS?: Property,
            CREATED?: Types.DateTime,
            DESCRIPTION?: Property,
            DTSTART?: Types.DateTime,
            GEO?: Types.GEO,
            'LAST-MODIFIED'?: Types.DateTime,
            'RECURRENCE-ID'?: Types.DateTime,
            LOCATION?: Property,
            ORGANIZER?: Types.CALAddress,
            ATTENDEE?: Types.CALAddress[],
            PRIORITY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
            SEQUENCE?: Property,
            URL?: Types.URI,
            RECURID?: Property,
            RRULE?: RRule,
            RDATE?: DateTime[],
            EXDATE?: DateTime[],
            COMMENT?: Property[],
            CATEGORIES?: Property,
            VALARM?: VALARM[],
        } & XOR<{DTEND?: Types.DateTime}, {DURATION?: Types.Interval}>
    }

}