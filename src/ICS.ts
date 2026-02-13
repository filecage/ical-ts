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
import RefreshInterval from "./Parser/Properties/RefreshInterval";
import Source from "./Parser/Properties/Source";
import Color from "./Parser/Properties/Color";
import Image from "./Parser/Properties/Image";
import Conference from "./Parser/Properties/Conference";

export namespace ICS {
    export type NonStandardPropertyAware = {nonStandard?: {[key: string]: undefined|Property<unknown>[] }};

    export type JSON = {
        VCALENDAR: VCALENDAR[]
    }

    export type VCALENDAR = NonStandardPropertyAware & {
        PRODID: Property,
        VERSION: Version,
        UID?: UniqueIdentifier,
        'LAST-MODIFIED'?: LastModified,
        URL?: UniformResourceLocator,
        CALSCALE?: CalendarScale,
        CATEGORIES?: Categories,
        COLOR?: Color,
        COMMENT?: Comment[],
        IMAGE?: Image,
        'REFRESH-INTERVAL'?: RefreshInterval,
        SOURCE?: Source,
        VEVENT?: VEVENT.Published[],
        VTIMEZONE?: VTIMEZONE[],
    };

    export type VTIMEZONE = NonStandardPropertyAware & {
        TZID: TimeZoneIdentifier,
        TZURL?: TimeZoneUrl,
        'LAST-MODIFIED'?: LastModified,
        DAYLIGHT?: TimezoneDefinition[],
        STANDARD?: TimezoneDefinition[]
    }

    export type TimezoneDefinition = NonStandardPropertyAware & {
        COMMENT?: Property[],
        TZOFFSETFROM: TimeZoneOffsetFrom, // Example: -0800
        TZOFFSETTO: TimeZoneOffsetTo,   // Example: -0700
        DTSTART: DateTimeStart,    // In local format
        TZNAME?: TimeZoneName,
    } & XOR<{ RRULE?: RecurrenceRule }, {RDATE?: RecurrenceDateTimes[]}>

    export type VALARM = NonStandardPropertyAware & {
        ACTION: Action,
        TRIGGER: Duration,
        DESCRIPTION?: Description,
        SUMMARY?: Summary,
        ATTENDEE?: Attendee[],
    }

    export namespace VEVENT {
        export type Published = {DTSTART: DateTimeStart} & Event;

        type Event = NonStandardPropertyAware & {
            UID: UniqueIdentifier,
            DTSTAMP: DateTimeStamp,
            SUMMARY: Summary,

            STATUS?: Status,
            TRANSP?: TimeTransparency,

            CLASS?: Classification,
            CREATED?: DateTimeCreated,
            COLOR?: Color,
            CONFERENCE?: Conference[],
            DESCRIPTION?: Description[],
            DTSTART?: DateTimeStart,
            GEO?: GeographicPosition,
            IMAGE?: Image,
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