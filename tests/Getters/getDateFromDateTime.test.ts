import {ICS} from "../../src";
import {DateTime} from "../../src/Parser/ValueTypes/DateTime";
import DateTimeStart from "../../src/Parser/Properties/DateTimeStart";
import TimeZoneIdentifier from "../../src/Parser/Properties/TimeZoneIdentifier";
import {getDateFromDateTime} from "../../src/Getters/getDateFromDateTime";
import TimeZoneOffsetFrom from "../../src/Parser/Properties/TimeZoneOffsetFrom";
import TimeZoneOffsetTo from "../../src/Parser/Properties/TimeZoneOffsetTo";
import RecurrenceRule from "../../src/Parser/Properties/RecurrenceRule";
import {parseDateTime, parseOffset, parseRecurrence} from "../../src/Parser/parseValues";


const VTIMZEZONES: ICS.VTIMEZONE[] = [
    {
        TZID: new TimeZoneIdentifier('Europe/Berlin', {}),
        DAYLIGHT: [{
            TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
            TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0200'), {}),
            DTSTART: new DateTimeStart(parseDateTime('19700329T020000', {}), {}),
            RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU'), {}),
        }],
        STANDARD: [
            {
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0200'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0100'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19701025T030000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU'), {}),
            }
        ]
    },
    {
        TZID: new TimeZoneIdentifier('Etc/GMT', {}),
        STANDARD: [
            {
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0000'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0000'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19710101T000000', {}), {}),
            }
        ]
    }
];

describe('getDateFromDateTime Tests', () => {
    const samples: [string, DateTime, number][] = [
        ['UTC date and time', parseDateTime('20240523T095445Z', {}), 1716458085000],
        ['Floating date and time', parseDateTime('20240523T115445', {}), 1716465285000],
        ['Etc/GMT', parseDateTime('20240523T095445', {TZID: 'Etc/GMT'}), 1716458085000],
        ['Europe/Berlin in daylight time', parseDateTime('20240523T115445', {TZID: 'Europe/Berlin'}), 1716458085000],
        ['Europe/Berlin in standard time', parseDateTime('20240323T115445', {TZID: 'Europe/Berlin'}), 1711191285000],
    ];

    it.each(samples)('Should correctly get date from DateTime %s', (name, dateTime, expectedUnixTimestampMS) => {
        expect(getDateFromDateTime(dateTime, VTIMZEZONES).valueOf()).toBe(expectedUnixTimestampMS);
    });
});