
// THIS FILE IS BEING AUTO GENERATED, DO NOT EDIT!
// @see compiler/parameters/parameters.ts
 import {SEMICOLON} from "../ParserConstants";
 import {parseParameters} from "./parseParameters";
 import Property from "./Property";

import {parseNumber, parseValueRaw, parseDateTime, parsePeriod, parseList} from "./parseValues"
import Acknowledged from "./Properties/Acknowledged";
import Action from "./Properties/Action";
import Attachment from "./Properties/Attachment";
import Attendee from "./Properties/Attendee";
import CalendarScale from "./Properties/CalendarScale";
import Categories from "./Properties/Categories";
import Classification from "./Properties/Classification";
import Comment from "./Properties/Comment";
import Contact from "./Properties/Contact";
import DateTimeCompleted from "./Properties/DateTimeCompleted";
import DateTimeCreated from "./Properties/DateTimeCreated";
import DateTimeDue from "./Properties/DateTimeDue";
import DateTimeEnd from "./Properties/DateTimeEnd";
import DateTimeStamp from "./Properties/DateTimeStamp";
import DateTimeStart from "./Properties/DateTimeStart";
import Description from "./Properties/Description";
import Duration from "./Properties/Duration";
import ExceptionDateTimes from "./Properties/ExceptionDateTimes";
import FreeBusyTime from "./Properties/FreeBusyTime";
import GeographicPosition from "./Properties/GeographicPosition";
import LastModified from "./Properties/LastModified";
import Location from "./Properties/Location";
import Method from "./Properties/Method";
import Organizer from "./Properties/Organizer";
import PercentComplete from "./Properties/PercentComplete";
import Priority from "./Properties/Priority";
import ProductIdentifier from "./Properties/ProductIdentifier";
import Proximity from "./Properties/Proximity";
import RecurrenceDateTimes from "./Properties/RecurrenceDateTimes";
import RecurrenceID from "./Properties/RecurrenceID";
import RecurrenceRule from "./Properties/RecurrenceRule";
import RelatedTo from "./Properties/RelatedTo";
import Repeat from "./Properties/Repeat";
import Resources from "./Properties/Resources";
import Sequence from "./Properties/Sequence";
import Status from "./Properties/Status";
import Summary from "./Properties/Summary";
import TimeTransparency from "./Properties/TimeTransparency";
import TimeZoneIdentifier from "./Properties/TimeZoneIdentifier";
import TimeZoneName from "./Properties/TimeZoneName";
import TimeZoneOffsetFrom from "./Properties/TimeZoneOffsetFrom";
import TimeZoneOffsetTo from "./Properties/TimeZoneOffsetTo";
import TimeZoneUrl from "./Properties/TimeZoneUrl";
import Trigger from "./Properties/Trigger";
import UniformResourceLocator from "./Properties/UniformResourceLocator";
import UniqueIdentifier from "./Properties/UniqueIdentifier";
import Version from "./Properties/Version";

export function parseProperty (key: string, value: string) {
    const fragments = key.split(SEMICOLON);
    const propertyKey = fragments.shift()?.toUpperCase() || '';
    const parameters = parseParameters(fragments);

    switch (propertyKey) {
        case 'ACKNOWLEDGED': return new Acknowledged(parseDateTime(value), parameters);
        case 'ACTION': return new Action(parseValueRaw(value), parameters);
        case 'ATTACH': return new Attachment(parseValueRaw(value), parameters);
        case 'ATTENDEE': return new Attendee(parseValueRaw(value), parameters);
        case 'CALSCALE': return new CalendarScale(assertEnum('CalendarScale', parseValueRaw(value), ['GREGORIAN'] as const), parameters);
        case 'CATEGORIES': return new Categories(parseValueRaw(value), parameters);
        case 'CLASS': return new Classification(parseValueRaw(value), parameters);
        case 'COMMENT': return new Comment(parseValueRaw(value), parameters);
        case 'CONTACT': return new Contact(parseValueRaw(value), parameters);
        case 'COMPLETED': return new DateTimeCompleted(parseDateTime(value), parameters);
        case 'CREATED': return new DateTimeCreated(parseDateTime(value), parameters);
        case 'DUE': return new DateTimeDue(parseDateTime(value), parameters);
        case 'DTEND': return new DateTimeEnd(parseDateTime(value), parameters);
        case 'DTSTAMP': return new DateTimeStamp(parseDateTime(value), parameters);
        case 'DTSTART': return new DateTimeStart(parseDateTime(value), parameters);
        case 'DESCRIPTION': return new Description(parseValueRaw(value), parameters);
        case 'DURATION': return new Duration(parseValueRaw(value), parameters);
        case 'EXDATE': return new ExceptionDateTimes(parseList(value).map(value => parseDateTime(value)), parameters);
        case 'FREEBUSY': return new FreeBusyTime(parseList(value).map(value => parsePeriod(value)), parameters);
        case 'GEO': return new GeographicPosition(parseValueRaw(value), parameters);
        case 'LAST-MODIFIED': return new LastModified(parseDateTime(value), parameters);
        case 'LOCATION': return new Location(parseValueRaw(value), parameters);
        case 'METHOD': return new Method(parseValueRaw(value), parameters);
        case 'ORGANIZER': return new Organizer(parseValueRaw(value), parameters);
        case 'PERCENT-COMPLETE': return new PercentComplete(parseNumber(value), parameters);
        case 'PRIORITY': return new Priority(parseValueRaw(value), parameters);
        case 'PRODID': return new ProductIdentifier(parseValueRaw(value), parameters);
        case 'PROXIMITY': return new Proximity(parseValueRaw(value), parameters);
        case 'RDATE': return new RecurrenceDateTimes(parseList(value).map(value => parseValueRaw(value)), parameters);
        case 'RECURRENCE-ID': return new RecurrenceID(parseDateTime(value), parameters);
        case 'RRULE': return new RecurrenceRule(parseValueRaw(value), parameters);
        case 'RELATED-TO': return new RelatedTo(parseValueRaw(value), parameters);
        case 'REPEAT': return new Repeat(parseValueRaw(value), parameters);
        case 'RESOURCES': return new Resources(parseValueRaw(value), parameters);
        case 'SEQUENCE': return new Sequence(parseValueRaw(value), parameters);
        case 'STATUS': return new Status(parseValueRaw(value), parameters);
        case 'SUMMARY': return new Summary(parseValueRaw(value), parameters);
        case 'TRANSP': return new TimeTransparency(assertEnum('TimeTransparency', parseValueRaw(value), ['OPAQUE', 'TRANSPARENT'] as const), parameters);
        case 'TZID': return new TimeZoneIdentifier(parseValueRaw(value), parameters);
        case 'TZNAME': return new TimeZoneName(parseValueRaw(value), parameters);
        case 'TZOFFSETFROM': return new TimeZoneOffsetFrom(parseValueRaw(value), parameters);
        case 'TZOFFSETTO': return new TimeZoneOffsetTo(parseValueRaw(value), parameters);
        case 'TZURL': return new TimeZoneUrl(parseValueRaw(value), parameters);
        case 'TRIGGER': return new Trigger(parseValueRaw(value), parameters);
        case 'URL': return new UniformResourceLocator(parseValueRaw(value), parameters);
        case 'UID': return new UniqueIdentifier(parseValueRaw(value), parameters);
        case 'VERSION': return new Version(assertEnum('Version', parseValueRaw(value), ['2.0'] as const), parameters);

        default:
            if (propertyKey.startsWith('X-') || propertyKey.startsWith('IANA-')) {
                return new class extends Property<string> {
                    readonly key;
                    constructor(key: string, value: string) {
                        super(value, {});
                        this.key = key;
                    }
                } (key, value);
            }

            throw new Error(`Unexpected property '${propertyKey}'`);
    }

}

function assertEnum<T extends readonly string[]> (propertyName: string, value: string, enums: T) {
    if (enums.includes(value)) {
        return value as typeof enums[number];
    }

    throw new Error(`Property '${propertyName}' value '${value}' is invalid, must be one of: ${enums.join(', ')}`);
}