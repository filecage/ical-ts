import {ICS} from "../../src";
import {DateTime} from "../../src/Parser/ValueTypes/DateTime";
import DateTimeStart from "../../src/Parser/Properties/DateTimeStart";
import TimeZoneIdentifier from "../../src/Parser/Properties/TimeZoneIdentifier";
import {getDateFromDateTime} from "../../src/Getters/getDateFromDateTime";
import TimeZoneOffsetFrom from "../../src/Parser/Properties/TimeZoneOffsetFrom";
import TimeZoneOffsetTo from "../../src/Parser/Properties/TimeZoneOffsetTo";
import RecurrenceRule from "../../src/Parser/Properties/RecurrenceRule";
import {parseDateTime, parseOffset, parseRecurrence} from "../../src/Parser/parseValues";
import TimeZoneName from "../../src/Parser/Properties/TimeZoneName";


const VTIMZEZONES: ICS.VTIMEZONE[] = [
    {
        TZID: new TimeZoneIdentifier('Europe/Berlin', {}),
        DAYLIGHT: [{
            TZNAME: new TimeZoneName('CEST', {}),
            TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
            TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0200'), {}),
            DTSTART: new DateTimeStart(parseDateTime('19700329T020000', {}), {}),
            RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU'), {}),
        }],
        STANDARD: [
            {
                TZNAME: new TimeZoneName('CET', {}),
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
    },
    {
        TZID: new TimeZoneIdentifier('Etc/Narnia', {}),

        /**
         * Periode 1 1980-1990
         * Sommerzeit Start: 1.4., Offset: +2
         * Winterzeit: 1.10., Offset: +1
         *
         * Test 1: 1985-08-22 04:04 ==> 02:04 UTC
         * Test 2: 1985-02-14 03:33 ==> 02:33 UTC
         *
         * Periode 2 1990-2000
         * Sommerzeit Start: 1.3., Offset: +1h30m
         * Winterzeit Start: 1.11. Offset: +0h30m
         *
         * Test 1: 1993-08-22 04:04 ==> 02:34 UTC
         * Test 2: 1993-02-22 03:33 ==> 03:03 UTC
         *
         * Periode 3 >2000
         * Standard: +04:00
         *
         * Test 1: 2009-12-24 12:34 ==>  08:34 UTC
         */

        DAYLIGHT: [
            {
                // First daylight period: +0200 from 1st April to 1st October
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0200'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19800401T010000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=4;BYMONTHDAY=1'), {}),
            },
            {
                // Second daylight period: +0130 from 1st March to 1st November
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0230'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0130'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19900301T023000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=1;UNTIL=19991231'), {}),
            }
        ],
        STANDARD: [
            {
                // First standard period: +0100 for everything but 1st April to 1st October
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0200'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0100'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19801101T030000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=10;BYMONTHDAY=1'), {}),
            },
            {
                // Second standard period: +0030 for everything but 1st April to 1st October
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0100'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0030'), {}),
                DTSTART: new DateTimeStart(parseDateTime('19900101T020000', {}), {}),
                RRULE: new RecurrenceRule(parseRecurrence('FREQ=YEARLY;BYMONTH=11;BYMONTHDAY=1'), {}),
            },
            {
                // Third standard period: fixed +0400
                TZOFFSETFROM: new TimeZoneOffsetFrom(parseOffset('+0400'), {}),
                TZOFFSETTO: new TimeZoneOffsetTo(parseOffset('+0400'), {}),
                DTSTART: new DateTimeStart(parseDateTime('20000101T040000', {}), {})
            }
        ]
    },
];

describe('getDateFromDateTime Tests', () => {
    const samples: [string, DateTime, number][] = [
        ['UTC date and time', parseDateTime('20240523T095445Z', {}), 1716458085000],
        ['Floating date and time', parseDateTime('20240523T115445', {}), 1716465285000],
        ['Etc/GMT', parseDateTime('20240523T095445', {TZID: 'Etc/GMT'}), 1716458085000],
        ['Europe/Berlin in daylight time', parseDateTime('20240523T115445', {TZID: 'Europe/Berlin'}), 1716458085000],
        ['Europe/Berlin in standard time', parseDateTime('20240323T115445', {TZID: 'Europe/Berlin'}), 1711191285000],

        // Etc/Narnia timezone tests - testing each period
        ['Etc/Narnia - First Period, Standard', parseDateTime('19850822T040400', {TZID: 'Etc/Narnia'}), Date.UTC(1985, 7, 22, 2, 4)],
        ['Etc/Narnia - First Period, DST', parseDateTime('19850214T033300', {TZID: 'Etc/Narnia'}), Date.UTC(1985,1, 14, 2, 33)],
        ['Etc/Narnia - Second Period, Standard', parseDateTime('19930822T040400', {TZID: 'Etc/Narnia'}), Date.UTC(1993, 7, 22, 2, 34)],
        ['Etc/Narnia - Second Period, DST', parseDateTime('19930222T033300', {TZID: 'Etc/Narnia'}), Date.UTC(1993,1, 22, 3, 3)],
        ['Etc/Narnia - Third Period Period', parseDateTime('20091224T123456', {TZID: 'Etc/Narnia'}), Date.UTC(2009,11, 24, 8, 34, 56)],
    ];

    it.each(samples)('Should correctly get date from DateTime %s', (name, dateTime, expectedUnixTimestampMS) => {
        expect(getDateFromDateTime(dateTime, VTIMZEZONES).valueOf()).toBe(expectedUnixTimestampMS);
    });
});