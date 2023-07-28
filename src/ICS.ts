import {XOR} from "ts-xor";
import Property from "./Parser/Properties/Property";
import Version from "./Parser/Properties/Version";
import CalendarScale from "./Parser/Properties/CalendarScale";
import Comment from "./Parser/Properties/Comment";
import TimeZoneIdentifier from "./Parser/Properties/TimeZoneIdentifier";
import TimeZoneUrl from "./Parser/Properties/TimeZoneUrl";
import LastModified from "./Parser/Properties/LastModified";
import TimeZoneOffsetFrom from "./Parser/Properties/TimeZoneOffsetFrom";
import TimeZoneOffsetTo from "./Parser/Properties/TimeZoneOffsetTo";
import DateTimeStart from "./Parser/Properties/DateTimeStart";
import TimeZoneName from "./Parser/Properties/TimeZoneName";
import RecurrenceRule from "./Parser/Properties/RecurrenceRule";
import RecurrenceDateTimes from "./Parser/Properties/RecurrenceDateTimes";
import Action from "./Parser/Properties/Action";
import Duration from "./Parser/Properties/Duration";
import Description from "./Parser/Properties/Description";
import Summary from "./Parser/Properties/Summary";
import Attendee from "./Parser/Properties/Attendee";
import UniqueIdentifier from "./Parser/Properties/UniqueIdentifier";
import DateTimeStamp from "./Parser/Properties/DateTimeStamp";
import Status from "./Parser/Properties/Status";
import TimeTransparency from "./Parser/Properties/TimeTransparency";
import Classification from "./Parser/Properties/Classification";
import DateTimeCreated from "./Parser/Properties/DateTimeCreated";
import GeographicPosition from "./Parser/Properties/GeographicPosition";
import RecurrenceID from "./Parser/Properties/RecurrenceID";
import Location from "./Parser/Properties/Location";
import Organizer from "./Parser/Properties/Organizer";
import Priority from "./Parser/Properties/Priority";
import Sequence from "./Parser/Properties/Sequence";
import UniformResourceLocator from "./Parser/Properties/UniformResourceLocator";
import ExceptionDateTimes from "./Parser/Properties/ExceptionDateTimes";
import Categories from "./Parser/Properties/Categories";
import DateTimeEnd from "./Parser/Properties/DateTimeEnd";

export namespace ICS {
    export type NonStandardPropertyAware = { [key: `X-${string}`]: Property|undefined }
    export type IANAPropertyAware = { [key: `IANA-${string}`]: Property|undefined }

    export type JSON = {
        VCALENDAR: VCALENDAR[]
    }

    export type VCALENDAR = NonStandardPropertyAware & IANAPropertyAware & {
        PRODID: Property,
        VERSION: Version,
        CALSCALE?: CalendarScale,
        COMMENT?: Comment[],
        VEVENT?: VEVENT.Published[],
        VTIMEZONE?: VTIMEZONE[],
    };

    export type VTIMEZONE = NonStandardPropertyAware & IANAPropertyAware & {
        TZID: TimeZoneIdentifier,
        TZURL?: TimeZoneUrl,
        'LAST-MODIFIED'?: LastModified,
        DAYLIGHT?: TimezoneDefinition[],
        STANDARD?: TimezoneDefinition[]
    }

    export type TimezoneDefinition = NonStandardPropertyAware & IANAPropertyAware & {
        COMMENT?: Property[],
        TZOFFSETFROM: TimeZoneOffsetFrom, // Example: -0800
        TZOFFSETTO: TimeZoneOffsetTo,   // Example: -0700
        DTSTART: DateTimeStart,    // In local format
        TZNAME?: TimeZoneName,
    } & XOR<{ RRULE?: RecurrenceRule }, {RDATE?: RecurrenceDateTimes[]}>

    export type VALARM = NonStandardPropertyAware & IANAPropertyAware & {
        ACTION: Action,
        TRIGGER: Duration,
        DESCRIPTION?: Description,
        SUMMARY?: Summary,
        ATTENDEE?: Attendee[],
    }

    export namespace VEVENT {
        export type Published = {DTSTART: DateTimeStart} & Event;

        type Event = NonStandardPropertyAware & IANAPropertyAware & {
            UID: UniqueIdentifier,
            DTSTAMP: DateTimeStamp,
            SUMMARY: Summary,

            STATUS?: Status,
            TRANSP?: TimeTransparency,

            CLASS?: Classification,
            CREATED?: DateTimeCreated,
            DESCRIPTION?: Description,
            DTSTART?: DateTimeStart,
            GEO?: GeographicPosition,
            'LAST-MODIFIED'?: LastModified,
            'RECURRENCE-ID'?: RecurrenceID,
            LOCATION?: Location,
            ORGANIZER?: Organizer,
            ATTENDEE?: Attendee[],
            PRIORITY?: Priority,
            SEQUENCE?: Sequence,
            URL?: UniformResourceLocator,
            RRULE?: RecurrenceRule,
            RDATE?: RecurrenceDateTimes[],
            EXDATE?: ExceptionDateTimes[],
            COMMENT?: Comment[],
            CATEGORIES?: Categories,
            VALARM?: VALARM[],
        } & XOR<{DTEND?: DateTimeEnd}, {DURATION?: Duration}>
    }

}