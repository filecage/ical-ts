// import {ICSData} from "./ICSData";
import {BEGIN, COLON, Property as EProperty, END, EQUAL, LIST_PROPERTIES, NEW_LINE, SEMICOLON, SPACE, Component} from "./ParserConstants";
import {ICS} from "./ICS";
import {XOR} from "ts-xor";
import Property = ICS.Property;

export default class ICSParser {

    parseFromStringToJSON (raw: string) : unknown {
        const lines = this.unfold(raw.split(NEW_LINE));

        return this.parse(lines, {});
    }

    parse (lines: string[], context: {[key: string]: unknown}) : {[key: string]: unknown} {
        const line = lines.shift();
        if (line === undefined) {
            return context;
        }

        // Skip to next line if this line is empty
        if (line.trim() === '') {
            return this.parse(lines, context);
        }

        const index = line.indexOf(COLON);
        const key = line.substring(0, index);
        const value = line.substring(index + 1);

        if (key === BEGIN) {
            switch (value) {
                case Component.VTIMEZONE:
                    context[Component.VTIMEZONE] = this.parseTimezone(lines, context);
                    break;

                case Component.TZONE_DAYLIGHT:
                case Component.TZONE_STANDARD:
                    context[value] = this.parseTimezoneDefinition(lines, context, value);
                    break;

                case Component.VEVENT:
                    context[Component.VEVENT] = this.parseEvent(lines, context);
                    break;

                case Component.VCALENDAR:
                    context[Component.VCALENDAR] = this.parseCalendar(lines, context);
                    break;

                case Component.VALARM:
                    context[Component.VALARM] = this.parseAlarm(lines, context);
                    break;

                default:
                    throw new Error(`Unknown component type '${value}'`);
            }
        } else if (key !== END) {
            // Keys might contain additional properties
            const fragments = key.split(SEMICOLON);
            const propertyKey = fragments.shift()?.toUpperCase() || '';
            const property = new Property(propertyKey, value);
            for (const parameter of fragments) {
                const [parameterKey, parameterValue] = parameter.split(EQUAL);
                property.set(parameterKey, parameterValue);
            }

            if (LIST_PROPERTIES.includes(propertyKey as EProperty)) {
                if (context[propertyKey] === undefined) {
                    context[propertyKey] = [];
                }

                (context[propertyKey] as Property[]).push(property);
            } else {
                if (context[propertyKey] !== undefined) {
                    throw new Error(`Non-list component '${propertyKey}' appeared twice`);
                }

                context[propertyKey] = property;
            }
        } else {
            // If the block ends we return our context
            return context;
        }

        // If the block is not meant to end here, continue parsing
        return this.parse(lines, context);
    }

    private parseCalendar (lines: string[], context: {[key: string]: unknown}) : ICS.VCALENDAR[] {
        const calendars: ICS.VCALENDAR[] = (context[Component.VCALENDAR] as ICS.VCALENDAR[]) || [];
        const data = this.parse(lines, {});

        const VERSION = this.pickOrThrow<Property<'2.0'>>(data, 'VERSION');
        if (VERSION.value !== '2.0') {
            throw new Error("Parser only supports version 2.0");
        }

        return [...calendars, {
            PRODID: this.pickOrThrow<Property>(data, 'PRODID'),
            VERSION,
            CALSCALE: this.pick<Property<'GREGORIAN'>>(data, 'CALSCALE'),
            COMMENT: this.pick(data, 'COMMENT'),
            ...this.pickNonStandardProperties(data),
            VTIMEZONE: this.pick<ICS.VTIMEZONE[]>(data, Component.VTIMEZONE),
            VEVENT: this.pick<ICS.VEVENT.Published[]>(data, Component.VEVENT),
        }];
    }

    private parseEvent (lines: string[], context: {[key: string]: unknown}) : ICS.VEVENT.Published[] {
        const events: ICS.VEVENT.Published[] = (context[Component.VEVENT] as ICS.VEVENT.Published[]) || [];
        const data = this.parse(lines, {});

        const event: ICS.VEVENT.Published = {
            DTSTAMP: this.pickOrThrow<ICS.Types.DateTime>(data, 'DTSTAMP'),
            DTSTART: this.pickOrThrow<ICS.Types.DateTime>(data, 'DTSTART'),
            ...this.pickDurationOrDateTimeEnd(data),
            UID: this.pickOrThrow(data, 'UID'),
            CREATED: this.pick(data, 'CREATED'),
            DESCRIPTION: this.pick(data, 'DESCRIPTION'),
            'LAST-MODIFIED': this.pick(data, 'LAST-MODIFIED'),
            'RECURRENCE-ID': this.pick(data, 'RECURRENCE-ID'),
            LOCATION: this.pick(data, 'LOCATION'),
            SEQUENCE: this.pick(data, 'SEQUENCE'),
            STATUS: this.pick(data, 'STATUS'),
            SUMMARY: this.pickOrThrow(data, 'SUMMARY'),
            TRANSP: this.pick(data, 'TRANSP'),
            VALARM: this.pick(data, 'VALARM'),
            CLASS: this.pick(data, 'CLASS'),
            COMMENT: this.pick(data, 'COMMENT'),
            ORGANIZER: this.pick(data, 'ORGANIZER'),
            RRULE: this.pick(data, 'RRULE'),
            RDATE: this.pick(data, 'RDATE'),
            EXDATE: this.pick(data, 'EXDATE'),
            ATTENDEE: this.pick(data, 'ATTENDEE'),
            ...this.pickNonStandardProperties(data),
        };

        return [...events, event];
    }

    private pickDurationOrDateTimeEnd (data: {[key: string]: unknown}) : undefined|XOR<{DURATION: ICS.Types.Interval}, {DTEND: ICS.Types.DateTime}> {
        const DTEND = this.pick<ICS.Types.DateTime>(data, 'DTEND');
        if (DTEND !== undefined) {
            return {DTEND};
        }

        const DURATION = this.pick<ICS.Types.Interval>(data, 'DURATION');
        if (DURATION !== undefined) {
            return {DURATION};
        }

        return undefined;
    }

    private parseAlarm (lines: string[], context: {[key: string]: unknown}) : ICS.VALARM[] {
        const alarms: ICS.VALARM[] = (context[Component.VALARM] as ICS.VALARM[]) || [];
        const data = this.parse(lines, {});

        return [...alarms, {
            ACTION: this.pickOrThrow(data, 'ACTION'),
            DESCRIPTION: this.pick(data, 'DESCRIPTION'),
            SUMMARY: this.pick(data, 'SUMMARY'),
            ATTENDEE: this.pick(data, 'ATTENDEE'),
            TRIGGER: this.pickOrThrow(data, 'TRIGGER'),
        }];
    }

    private parseTimezone (lines: string[], context: {[key: string]: unknown}) : ICS.VTIMEZONE[] {
        const timezones: ICS.VTIMEZONE[] = (context[Component.VTIMEZONE] as ICS.VTIMEZONE[]) || [];
        const data = this.parse(lines, {});
        const timezone: ICS.VTIMEZONE = {
            TZID: this.pickOrThrow<Property>(data, 'TZID'),
            ...this.pickNonStandardProperties(data),
            DAYLIGHT: this.pick<ICS.TimezoneDefinition[]>(data, 'DAYLIGHT'),
            STANDARD: this.pick<ICS.TimezoneDefinition[]>(data, 'STANDARD'),
        };

        return [...timezones, timezone];
    }

    private parseTimezoneDefinition (lines: string[], context: {[key: string]: unknown}, type: Component.TZONE_STANDARD | Component.TZONE_DAYLIGHT) : ICS.TimezoneDefinition[] {
        const timezoneDefinitions: ICS.TimezoneDefinition[] = (context[type] as ICS.TimezoneDefinition[]) || [];
        const data = this.parse(lines, {});

        return [...timezoneDefinitions, {
            TZOFFSETFROM: this.pickOrThrow<Property>(data, 'TZOFFSETFROM'),
            TZOFFSETTO: this.pickOrThrow<Property>(data, 'TZOFFSETTO'),
            TZNAME: this.pick<Property>(data, 'TZNAME'),
            DTSTART: this.pickOrThrow<ICS.Types.DateTime>(data, 'DTSTART'),
            ...this.pickNonStandardProperties(data),
            ...this.pickRRuleOrRdate(data),
        }];
    }

    private pickRRuleOrRdate (data: {[key: string]: unknown}) : undefined | {RRULE: ICS.Types.RRule} | {RDATE: (ICS.Types.DateTime|ICS.Types.Date)[]} {
        const RRULE = this.pick<ICS.Types.RRule>(data, 'RRULE');
        if (RRULE !== undefined) {
            return {RRULE};
        }

        const RDATE = this.pick<(ICS.Types.Date|ICS.Types.DateTime)[]>(data, 'RDATE');
        if (RDATE !== undefined) {
            return {RDATE};
        }

        return undefined;
    }

    // to unfold content lines according to https://datatracker.ietf.org/doc/html/rfc5545#section-3.1
    unfold (lines: string[]) : string[] {
        return lines.reduce((buffer: string[], line) => {
            if (line.startsWith(SPACE)) {
                buffer[buffer.length - 1] += line.substring(1);
            } else {
                buffer.push(line);
            }

            return buffer;
        }, []);
    }

    private pickOrThrow<T = Property> (data: {[key: string]: unknown}, key: string) : T {
        if (data[key] === undefined) {
            throw new Error(`Missing mandatory key '${key}'`);
        }

        return data[key] as T;
    }

    private pick<T = Property> (data: {[key: string]: unknown}, key: string) : T|undefined {
        if (data[key] === undefined) {
            return undefined;
        }

        return data[key] as T;
    }

    private pickNonStandardProperties (data: {[key: string]: unknown}) : ICS.NonStandardPropertyAware {
        const nonStandardPropertyData: {[key: string]: Property} = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith('X-') && value instanceof Property) {
                nonStandardPropertyData[key] = value;
            }
        }

        return nonStandardPropertyData;
    }
}