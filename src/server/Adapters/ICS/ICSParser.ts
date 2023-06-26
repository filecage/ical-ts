// import {ICSData} from "./ICSData";
import {BEGIN, COLON, Components, END, EQUAL, LIST_COMPONENTS, NEW_LINE, SEMICOLON, SPACE} from "./ParserConstants";
import {ICS} from "./ICS";
import {XOR} from "ts-xor";
import Value = ICS.Value;

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
                case Components.VTIMEZONE:
                    context[Components.VTIMEZONE] = this.parseTimezone(lines, context);
                    break;

                case Components.TZONE_DAYLIGHT:
                case Components.TZONE_STANDARD:
                    context[value] = this.parseTimezoneDefinition(lines, context, value);
                    break;

                case Components.VEVENT:
                    context[Components.VEVENT] = this.parseEvent(lines, context);
                    break;

                case Components.VCALENDAR:
                    context[Components.VCALENDAR] = this.parseCalendar(lines, context);
                    break;

                case Components.VALARM:
                    context[Components.VALARM] = this.parseAlarm(lines, context);
                    break;

                default:
                    throw new Error(`Unknown component type '${value}'`);
            }
        } else if (key !== END) {
            // Keys might contain additional properties
            const fragments = key.split(SEMICOLON);
            const component = fragments.shift()?.toUpperCase() || '';
            const container = new Value(component, value);
            for (const property of fragments) {
                const [propertyKey, propertyValue] = property.split(EQUAL);
                container.set(propertyKey, propertyValue);
            }

            if (LIST_COMPONENTS.includes(component as Components)) {
                if (context[component] === undefined) {
                    context[component] = [];
                }

                (context[component] as Value[]).push(container);
            } else {
                if (context[component] !== undefined) {
                    throw new Error(`Non-list component '${component}' appeared twice`);
                }

                context[component] = container;
            }
        } else {
            // If the block ends we return our context
            return context;
        }

        // If the block is not meant to end here, continue parsing
        return this.parse(lines, context);
    }

    private parseCalendar (lines: string[], context: {[key: string]: unknown}) : ICS.VCALENDAR[] {
        const calendars: ICS.VCALENDAR[] = (context[Components.VCALENDAR] as ICS.VCALENDAR[]) || [];
        const data = this.parse(lines, {});

        const VERSION = this.pickOrThrow<Value<'2.0'>>(data, 'VERSION');
        if (VERSION.value !== '2.0') {
            throw new Error("Parser only supports version 2.0");
        }

        return [...calendars, {
            PRODID: this.pickOrThrow<Value>(data, 'PRODID'),
            VERSION,
            CALSCALE: this.pick<Value<'GREGORIAN'>>(data, 'CALSCALE'),
            ...this.pickNonStandardProperties(data),
            VTIMEZONE: this.pick<ICS.VTIMEZONE[]>(data, Components.VTIMEZONE),
            VEVENT: this.pick<ICS.VEVENT.Published[]>(data, Components.VEVENT),
        }];
    }

    private parseEvent (lines: string[], context: {[key: string]: unknown}) : ICS.VEVENT.Published[] {
        const events: ICS.VEVENT.Published[] = (context[Components.VEVENT] as ICS.VEVENT.Published[]) || [];
        const data = this.parse(lines, {});

        const event: ICS.VEVENT.Published = {
            DTSTART: this.pickOrThrow<ICS.Types.DateTime>(data, 'DTSTART'),
            ...this.pickDurationOrDtendOrThrow(data),
            DTSTAMP: this.pickOrThrow<ICS.Types.DateTime>(data, 'DTSTAMP'),
            UID: this.pickOrThrow(data, 'UID'),
            CREATED: this.pick(data, 'CREATED'),
            DESCRIPTION: this.pick(data, 'DESCRIPTION'),
            'LAST-MODIFIED': this.pick(data, 'LAST-MODIFIED'),
            LOCATION: this.pick(data, 'LOCATION'),
            SEQUENCE: this.pick(data, 'SEQUENCE'),
            STATUS: this.pick(data, 'STATUS'),
            SUMMARY: this.pickOrThrow(data, 'SUMMARY'),
            TRANSP: this.pick(data, 'TRANSP'),
            VALARM: this.pick(data, 'VALARM'),
            ...this.pickNonStandardProperties(data),
        };

        return [...events, event];
    }

    private pickDurationOrDtendOrThrow (data: {[key: string]: unknown}) : XOR<{DURATION: ICS.Types.Interval}, {DTEND: ICS.Types.DateTime}> {
        const DTEND = this.pick<ICS.Types.DateTime>(data, 'DTEND');
        if (DTEND !== undefined) {
            return {DTEND};
        }

        const DURATION = this.pick<ICS.Types.Interval>(data, 'DURATION');
        if (DURATION !== undefined) {
            return {DURATION};
        }

        throw new Error("Either 'DURATION' or 'DTEND' has to be present for 'VEVENT'");
    }

    private parseAlarm (lines: string[], context: {[key: string]: unknown}) : ICS.VALARM[] {
        const alarms: ICS.VALARM[] = (context[Components.VALARM] as ICS.VALARM[]) || [];
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
        const timezones: ICS.VTIMEZONE[] = (context[Components.VTIMEZONE] as ICS.VTIMEZONE[]) || [];
        const data = this.parse(lines, {});
        const timezone: ICS.VTIMEZONE = {
            TZID: this.pickOrThrow<Value>(data, 'TZID'),
            ...this.pickNonStandardProperties(data),
            DAYLIGHT: this.pick<ICS.TimezoneDefinition[]>(data, 'DAYLIGHT'),
            STANDARD: this.pick<ICS.TimezoneDefinition[]>(data, 'STANDARD'),
        };

        return [...timezones, timezone];
    }

    private parseTimezoneDefinition (lines: string[], context: {[key: string]: unknown}, type: Components.TZONE_STANDARD | Components.TZONE_DAYLIGHT) : ICS.TimezoneDefinition[] {
        const timezoneDefinitions: ICS.TimezoneDefinition[] = (context[type] as ICS.TimezoneDefinition[]) || [];
        const data = this.parse(lines, {});

        return [...timezoneDefinitions, {
            TZOFFSETFROM: this.pickOrThrow<Value>(data, 'TZOFFSETFROM'),
            TZOFFSETTO: this.pickOrThrow<Value>(data, 'TZOFFSETTO'),
            TZNAME: this.pick<Value>(data, 'TZNAME'),
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

    private pickOrThrow<T = Value> (data: {[key: string]: unknown}, key: string) : T {
        if (data[key] === undefined) {
            throw new Error(`Missing mandatory key '${key}'`);
        }

        return data[key] as T;
    }

    private pick<T = Value> (data: {[key: string]: unknown}, key: string) : T|undefined {
        if (data[key] === undefined) {
            return undefined;
        }

        return data[key] as T;
    }

    private pickNonStandardProperties (data: {[key: string]: unknown}) : ICS.NonStandardPropertyAware {
        const nonStandardPropertyData: {[key: string]: Value} = {};
        for (const [key, value] of Object.entries(data)) {
            if (key.startsWith('X-') && value instanceof Value) {
                nonStandardPropertyData[key] = value;
            }
        }

        return nonStandardPropertyData;
    }
}